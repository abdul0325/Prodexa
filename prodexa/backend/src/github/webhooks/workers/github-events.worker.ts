/* eslint-disable prettier/prettier */
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

import { Logger } from '@nestjs/common';

import { GITHUB_EVENTS_QUEUE } from '../queues/github-events.queue';
import { GithubEventNormalizerService } from '../services/github-event-normalizer.service';
import { MetricsAggregationService } from 'src/analytics/services/metrics-aggregation.service';
import { CommitService } from 'src/analytics/services/commit.service';
import { PullRequestService } from 'src/analytics/services/pull-request.service';
import { KPIService } from 'src/analytics/services/kpi.service';
import { RealtimeGateway } from 'src/gateway/realtime.gateway';
import { GithubCommitDetailsService } from 'src/github/services/github-commit-details.service';
import { CommitFileChangeService } from 'src/analytics/services/commit-file-change.service';
import { ImpactAnalysisService } from 'src/intelligence/code-analysis/impact-analysis.service';
import { AnalyticsQueueService } from 'src/analytics/analytics.service';

@Processor(GITHUB_EVENTS_QUEUE)
export class GithubEventsWorker extends WorkerHost {

    constructor(
        private readonly normalizer: GithubEventNormalizerService,
        private readonly aggregator: MetricsAggregationService,
        private readonly commitService: CommitService,
        private readonly gateway: RealtimeGateway,
        private readonly pullRequestService: PullRequestService,
        private readonly kpiService: KPIService,
        private readonly githubCommitDetails: GithubCommitDetailsService,
        private readonly commitFileChange: CommitFileChangeService,
        private readonly impactAnalysis: ImpactAnalysisService,
        private readonly analyticsQueueService: AnalyticsQueueService,
    ) {
        super();
    }

    private readonly logger =
        new Logger(GithubEventsWorker.name);

    async process(job: Job<any>): Promise<any> {
        const { event, payload } = job.data;

        this.logger.log(
            `Processing GitHub event: ${event}`,
        );

        switch (event) {
            case 'push':
                await this.handlePush(payload);
                break;

            case 'pull_request':
                await this.handlePullRequest(payload);
                break;

            case 'issues':
                await this.handleIssue(payload);
                break;

            default:
                this.logger.warn(
                    `Unhandled event: ${event}`,
                );
        }

        return {
            success: true,
        };
    }

    private async handlePush(payload: any) {
        console.log(
            'NEW HANDLE PUSH EXECUTING',
        );

        const normalized =
            await this.normalizer.normalizePushEvent(
                payload,
            );
        console.log(
            'PROJECT ID FOUND:',
            normalized.projectId,
        );
        console.log(
            'NORMALIZED RESULT',
            normalized,
        );
        console.log('STEP 1');
        await this.commitService.storeCommits(
            normalized,
        );

        const repoFullName =
            payload.repository.full_name;

        const [owner, repo] =
            repoFullName.split('/');

        for (
            const commit
            of normalized.commits
        ) {

            const details =
                await this.githubCommitDetails
                    .fetchCommitDetails(
                        owner,
                        repo,
                        commit.sha,
                    );
            console.log('STEP 2');
            await this.commitFileChange
                .storeCommitFiles(
                    commit.sha,
                    details.files || [],
                );
            console.log('STEP 3');
            await this.impactAnalysis
                .analyzeCommit(
                    commit.sha,
                );
        }
        console.log('STEP 4');
        await this.aggregator.aggregateDailyMetrics(
            normalized,
        );

        if (normalized.projectId) {

            console.log('STEP 5');

            await this.analyticsQueueService
                .addProjectAnalysisJob(
                    normalized.projectId,
                );

            console.log('STEP 6');

            this.gateway.emitIntelligenceUpdate(
                normalized.projectId,
            );
        }
    }

    private async handlePullRequest(
        payload: any,
    ) {

        const normalized =
            await this.normalizer
                .normalizePullRequestEvent(
                    payload,
                );

        await this.kpiService
            .calculatePRCycleTime(
                normalized,
            );

        await this.pullRequestService
            .storePullRequest(
                normalized,
            );
    }

    private async handleIssue(payload: any) {
    }


}