/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AIInsightsService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async generateInsights(
        projectId: string,
    ) {

        const insights: string[] = [];

        await this.analyzePRCycleTime(
            projectId,
            insights,
        );

        await this.analyzeCommitActivity(
            projectId,
            insights,
        );
        await this.analyzeLargePRs(
            projectId,
            insights,
        );

        return {
            totalInsights:
                insights.length,

            insights,
        };
    }

    private async analyzePRCycleTime(
        projectId: string,
        insights: string[],
    ) {

        const avg =
            await this.prisma.engineeringKPI.aggregate({

                where: {

                    metricName:
                        'PR_CYCLE_TIME_HOURS',

                    repositoryId:
                        projectId,
                },

                _avg: {
                    metricValue: true,
                },
            });

        const value =
            avg._avg.metricValue || 0;

        if (value > 48) {

            insights.push(
                `PR cycle time is elevated at ${value.toFixed(1)} hours. Review bottlenecks may exist.`,
            );

        } else {

            insights.push(
                'PR cycle time appears healthy.',
            );
        }
    }

    private async analyzeCommitActivity(
        projectId: string,
        insights: string[],
    ) {

        const commits =
            await this.prisma.commitEvent.count({

                where: {

                    repositoryId:
                        projectId,

                    committedAt: {
                        gte: new Date(
                            Date.now() -
                            7 * 24 * 60 * 60 * 1000,
                        ),
                    },
                },
            });

        if (commits < 5) {

            insights.push(
                'Development activity appears lower than expected this week.',
            );

        } else {

            insights.push(
                'Commit activity is stable.',
            );
        }
    }

    private async analyzeLargePRs(
        projectId: string,
        insights: string[],
    ) {

        const largePRs =
            await this.prisma.pullRequestEvent.count({

                where: {

                    repositoryId:
                        projectId,

                    additions: {
                        gt: 1000,
                    },
                },
            });

        if (largePRs > 0) {

            insights.push(
                `${largePRs} oversized pull requests detected. Smaller PRs may improve review speed.`,
            );
        }
    }
}