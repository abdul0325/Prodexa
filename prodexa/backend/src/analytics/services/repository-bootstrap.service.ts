/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { GithubService } from 'src/github/github.service';

import { CommitService } from 'src/analytics/services/commit.service';
import { CommitFileChangeService } from 'src/analytics/services/commit-file-change.service';
import { MetricsAggregationService } from 'src/analytics/services/metrics-aggregation.service';

import { GithubCommitDetailsService } from 'src/github/services/github-commit-details.service';

import { ImpactAnalysisService } from 'src/intelligence/code-analysis/impact-analysis.service';
import { AnalyticsQueueService } from 'src/analytics/analytics.service';

@Injectable()
export class RepositoryBootstrapService {

    private readonly logger =
        new Logger(
            RepositoryBootstrapService.name,
        );

    constructor(
        private readonly prisma: PrismaService,
        private readonly githubService: GithubService,
        private readonly commitService: CommitService,
        private readonly githubCommitDetails: GithubCommitDetailsService,
        private readonly commitFileChange: CommitFileChangeService,
        private readonly impactAnalysis: ImpactAnalysisService,
        private readonly aggregator: MetricsAggregationService,
        private readonly analyticsQueueService: AnalyticsQueueService,
    ) { }

    async bootstrapRepository(
        projectId: string,
    ) {

        const project =
            await this.prisma.project.findUnique({

                where: {
                    id: projectId,
                },

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

            this.logger.warn(
                `Bootstrap skipped for project ${projectId}`,
            );

            return;
        }

        const owner =
            project.repoOwner;

        const repo =
            project.repoName;

        if (!owner || !repo) {
            this.logger.warn(
                `Project ${projectId} missing repoOwner/repoName`,
            );
            return;
        }

        const commits =
            await this.githubService.getAllCommits(
                owner,
                repo,
                project.user.githubToken,
            );

        console.log(
            'BOOTSTRAP COMMITS:',
            commits.length,
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

                login:
                    owner,
            },

            branch:
                'main',

            commits:
                commits.map(
                    (commit: any) => ({

                        sha:
                            commit.sha,

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

        let processed =
            0;

        for (
            const commit
            of normalized.commits
        ) {

            const exists =
                await this.commitService.commitExists(
                    commit.sha,
                );

            if (exists) {

                continue;
            }

            await this.commitService.storeCommits({

                ...normalized,

                commits: [
                    commit,
                ],
            });

            console.log(
                'BOOTSTRAP PROCESSING:',
                commit.sha,
            );

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

                processed++;

            } catch (error) {

                console.error(
                    'BOOTSTRAP FAILED FOR COMMIT:',
                    commit.sha,
                    error?.message,
                );
            }
        }

        await this.aggregator
            .aggregateDailyMetrics(
                normalized,
            );

        console.log(
            'BOOTSTRAP COMPLETE',
            {
                projectId,
                processed,
            },
        );

        await this.analyticsQueueService
            .addProjectAnalysisJob(
                projectId,
            );
    }
}