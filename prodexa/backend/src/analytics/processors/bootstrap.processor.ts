/* eslint-disable prettier/prettier */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubService } from 'src/github/github.service';
import { CommitService } from '../services/commit.service';
import { CommitFileChangeService } from '../services/commit-file-change.service';
import { MetricsAggregationService } from '../services/metrics-aggregation.service';
import { GithubCommitDetailsService } from 'src/github/services/github-commit-details.service';
import { ImpactAnalysisService } from 'src/intelligence/code-analysis/impact-analysis.service';
import { AnalyticsQueueService } from '../analytics.service';

@Processor('bootstrap')
export class BootstrapProcessor extends WorkerHost {

    private readonly logger =
        new Logger(BootstrapProcessor.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly githubService: GithubService,
        private readonly commitService: CommitService,
        private readonly githubCommitDetails: GithubCommitDetailsService,
        private readonly commitFileChange: CommitFileChangeService,
        private readonly impactAnalysis: ImpactAnalysisService,
        private readonly aggregator: MetricsAggregationService,
        private readonly analyticsQueueService: AnalyticsQueueService,
    ) {
        super();
    }

    async process(job: Job<any>) {

        console.log(
            'BOOTSTRAP PROCESSOR GOT:',
            job.name,
        );
        if (job.name === 'analyzeProject') {
            throw new Error(
                'AnalyzeProject reached BootstrapProcessor',
            );
        }
        if (job.name !== 'bootstrapProject') {
            return;
        }

        const { projectId } = job.data;

        const project =
            await this.prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    repository: true,
                    user: true,
                },
            });

        if (
            !project ||
            !project.repository ||
            !project.user?.githubToken
        ) {
            return;
        }

        const owner = project.repoOwner!;
        const repo = project.repoName!;

        const commits =
            await this.githubService.getAllCommits(
                owner,
                repo,
                project.user.githubToken,
            );

        const normalized = {
            projectId,
            repositoryId:
                project.repository.githubId,

            repository: {
                id:
                    project.repository.githubId,

                fullName:
                    project.repository.fullName,
            },

            author: {
                login: owner,
            },

            branch: 'main',

            commits: commits.map(
                (commit: any) => ({
                    sha: commit.sha,
                    message:
                        commit.commit?.message || '',
                    timestamp:
                        commit.commit?.author?.date ||
                        new Date().toISOString(),
                    url:
                        commit.html_url ||
                        commit.url ||
                        '',
                }),
            ),
        };

        for (const commit of normalized.commits) {

            const exists =
                await this.commitService.commitExists(
                    commit.sha,
                );

            if (exists) {
                continue;
            }

            await this.commitService.storeCommits({
                ...normalized,
                commits: [commit],
            });

            try {

                const details =
                    await this.githubCommitDetails
                        .fetchCommitDetails(
                            owner,
                            repo,
                            commit.sha,
                        );

                await this.commitFileChange
                    .storeCommitFiles(
                        commit.sha,
                        details.files || [],
                    );

                await this.impactAnalysis
                    .analyzeCommit(
                        commit.sha,
                    );

            } catch (err) {

                this.logger.error(
                    `Commit failed ${commit.sha}`,
                );
            }
        }

        await this.aggregator
            .aggregateDailyMetrics(
                normalized,
            );

        await this.analyticsQueueService
            .addProjectAnalysisJob(
                projectId,
            );
    }
}