/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

import { HealthCalculationService }
    from './health-calculation.service';

@Injectable()
export class MetricsAggregationService {

    constructor(
        private readonly prisma:
            PrismaService,
        private readonly healthCalculation:
            HealthCalculationService,
    ) { }

    private getStartOfDay(
        date: Date,
    ) {

        return new Date(

            date.getFullYear(),

            date.getMonth(),

            date.getDate(),
        );
    }

    async aggregateDailyMetrics(
        normalizedEvent: any,
    ) {
        console.log(
            'AGGREGATING SNAPSHOT',
            {
                projectId: normalizedEvent.projectId,
                repositoryId: normalizedEvent.repositoryId,
            },
        );
        const today =
            this.getStartOfDay(
                new Date(),
            );

        const projectId =
            normalizedEvent.projectId;

        const repositoryId =
            normalizedEvent.repositoryId;
        console.log(
            'COUNTING COMMITS FOR REPO:',
            repositoryId,
        );

        console.log(
            'PROJECT:',
            projectId,
        );
        if (!projectId) {
            console.error('No projectId in normalized event, skipping aggregation');
            return;
        }

        /*
         * SOURCE OF TRUTH:
         * CommitEvent table
         */

        const totalCommits =
            await this.prisma
                .commitEvent
                .count({

                    where: {
                        repositoryId,
                    },
                });

        /*
         * OPTIONAL:
         * Pull Requests
         */

        const totalPullRequests =
            await this.prisma
                .pullRequestEvent
                .count({

                    where: {
                        repositoryId,
                    },
                });

        /*
         * ACTIVE CONTRIBUTORS
         */

        const contributors =
            await this.prisma
                .commitEvent
                .findMany({

                    where: {
                        repositoryId,
                    },

                    distinct: [
                        'authorLogin',
                    ],
                });

        const activeContributors =
            contributors.length;

        /*
         * COMMIT VELOCITY
         */

        const commitVelocity =
            Math.round(
                totalCommits /
                Math.max(
                    activeContributors,
                    1,
                ),
            );

        /*
         * CALCULATE DAYS SINCE START (Rolling Window)
         * Track days since first snapshot for this project
         */

        const firstSnapshot =
            await this.prisma
                .dailyMetricsSnapshot
                .findFirst({

                    where: {
                        projectId,
                    },

                    orderBy: {
                        date: 'asc',
                    },
                });

        const daysSinceStart = firstSnapshot
            ? Math.floor(
                (today.getTime() -
                    firstSnapshot.date.getTime()) /
                (1000 * 60 * 60 * 24),
            )
            : 0;

        /*
         * CALCULATE MERGED PRs
         */

        const mergedPullRequests =
            await this.prisma
                .pullRequestEvent
                .count({

                    where: {
                        repositoryId,
                        state: 'merged',
                    },
                });

        /*
         * CALCULATE AVERAGE PR MERGE TIME
         */

        const mergedPRs =
            await this.prisma
                .pullRequestEvent
                .findMany({

                    where: {
                        repositoryId,
                        state: 'merged',
                        mergedAtGithub: {
                            not: null,
                        },
                    },

                    select: {
                        createdAtGithub: true,
                        mergedAtGithub: true,
                    },
                });

        let averagePRMergeTime: number | null = null;

        if (mergedPRs.length > 0) {
            const totalMergeTime = mergedPRs.reduce(
                (sum, pr) => {
                    const created = new Date(pr.createdAtGithub).getTime();
                    const merged = new Date(pr.mergedAtGithub!).getTime();
                    return sum + (merged - created);
                },
                0,
            );

            averagePRMergeTime =
                totalMergeTime / mergedPRs.length /
                (1000 * 60 * 60); // Convert to hours
        }

        /*
         * CALCULATE HEALTH SCORE
         */

        const healthBreakdown =
            await this.healthCalculation.calculateEngineeringHealth(
                repositoryId,
                {
                    totalCommits,
                    totalPullRequests,
                    mergedPullRequests,
                    activeContributors,
                    commitVelocity,
                    averagePRMergeTime,
                    daysSinceStart,
                },
            );

        const healthScore = healthBreakdown.finalHealthScore;

        /*
         * UPSERT SNAPSHOT
         */
        console.log({
            projectId,
            today,
            totalCommits,
            totalPullRequests,
            activeContributors,
            commitVelocity,
            healthScore,
        });
        console.log(
            'UPSERT SNAPSHOT SUCCESS',
            {
                projectId,
                totalCommits,
                totalPullRequests,
            },
        );
        await this.prisma
            .dailyMetricsSnapshot
            .upsert({

                where: {

                    projectId_date: {

                        projectId,

                        date: today,
                    },
                },

                update: {

                    totalCommits,

                    totalPullRequests,

                    activeContributors,

                    commitVelocity,

                    daysSinceStart,

                    mergedPullRequests,

                    averagePRMergeTime,

                    healthScore,
                },

                create: {

                    projectId,

                    date: today,

                    totalCommits,

                    totalPullRequests,

                    activeContributors,

                    commitVelocity,

                    daysSinceStart,

                    mergedPullRequests,

                    averagePRMergeTime,

                    healthScore,
                },
            });
        console.log(
            'SNAPSHOT SAVED',
            {
                projectId,
                date: today,
            },
        );

    }
}