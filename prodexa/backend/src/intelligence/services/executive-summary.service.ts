/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class ExecutiveSummaryService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) {}

    async generateSummary(
        projectId: string,
    ) {

        const summary: string[] = [];

        const latestSnapshot =
            await this.prisma
                .dailyMetricsSnapshot
                .findFirst({

                    where: {
                        projectId,
                    },

                    orderBy: {
                        date: 'desc',
                    },
                });

        const previousSnapshot =
            await this.prisma
                .dailyMetricsSnapshot
                .findMany({

                    where: {
                        projectId,
                    },

                    orderBy: {
                        date: 'desc',
                    },

                    take: 2,
                });

        const current =
            previousSnapshot[0];

        const previous =
            previousSnapshot[1];

        if (
            current &&
            previous
        ) {

            if (
                current.totalCommits >
                previous.totalCommits
            ) {

                summary.push(
                    'Engineering activity increased compared to the previous period.',
                );

            } else {

                summary.push(
                    'Engineering activity slowed compared to the previous period.',
                );
            }

            if (
                current.totalPullRequests >
                previous.totalPullRequests
            ) {

                summary.push(
                    'Pull request throughput improved.',
                );
            }

            if (
                (current.healthScore || 0)
                >
                (previous.healthScore || 0)
            ) {

                summary.push(
                    'Engineering health is improving.',
                );

            } else if (
                (current.healthScore || 0)
                <
                (previous.healthScore || 0)
            ) {

                summary.push(
                    'Engineering health declined compared to the previous period.',
                );
            } else {

                summary.push(
                    'Engineering health remains stable.',
                );
            }
        }

        const openPRs =
            await this.prisma
                .pullRequestEvent
                .count({

                    where: {
                        state: 'open',
                    },
                });

        if (openPRs > 10) {

            summary.push(
                'Review backlog risk detected due to elevated open pull requests.',
            );
        }

        const recentCommits =
            await this.prisma
                .commitEvent
                .count({

                    where: {
                        committedAt: {
                            gte: new Date(
                                Date.now()
                                - 7 * 24 * 60 * 60 * 1000,
                            ),
                        },
                    },
                });

        if (recentCommits < 5) {

            summary.push(
                'Contributor activity appears lower than expected this week.',
            );
        }

        return {

            generatedAt:
                new Date(),

            totalInsights:
                summary.length,

            summary,
        };
    }
}