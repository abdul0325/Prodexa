/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class ForecastingService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) {}

    async generateForecast(
        projectId: string,
    ) {

        const insights: string[] = [];

        let riskLevel =
            'LOW';

        const snapshots =
            await this.prisma
                .dailyMetricsSnapshot
                .findMany({

                    where: {
                        projectId,
                    },

                    orderBy: {
                        date: 'desc',
                    },

                    take: 7,
                });

        if (
            snapshots.length < 3
        ) {

            return {

                riskLevel:
                    'LOW',

                forecast: [
                    'Not enough historical data yet.',
                ],
            };
        }

        await this.detectVelocityDecline(
            snapshots,
            insights,
        );

        await this.detectPRBacklog(
            snapshots,
            insights,
        );

        await this.detectContributorRisk(
            projectId,
            insights,
        );

        if (
            insights.length >= 3
        ) {

            riskLevel = 'HIGH';

        } else if (
            insights.length >= 1
        ) {

            riskLevel =
                'MEDIUM';
        }

        return {
            riskLevel,
            forecast: insights,
        };
    }

    private async detectVelocityDecline(
        snapshots: any[],
        insights: string[],
    ) {

        const latest =
            snapshots[0]
                ?.totalCommits || 0;

        const oldest =
            snapshots[
                snapshots.length - 1
            ]?.totalCommits || 0;

        if (
            latest < oldest
        ) {

            insights.push(
                'Commit velocity has declined across recent periods.',
            );
        }
    }

    private async detectPRBacklog(
        snapshots: any[],
        insights: string[],
    ) {

        const latest =
            snapshots[0]
                ?.totalPullRequests || 0;

        if (latest > 15) {

            insights.push(
                'Pull request backlog is growing.',
            );
        }
    }

    private async detectContributorRisk(
        projectId: string,
        insights: string[],
    ) {

        const commits =
            await this.prisma
                .commitEvent
                .findMany({

                    where: {
                        repositoryId:
                            projectId,
                    },

                    select: {
                        authorLogin:
                            true,
                    },
                });

        const contributorMap:
            Record<string, number>
            = {};

        commits.forEach(c => {

            contributorMap[
                c.authorLogin
            ] =
                (contributorMap[
                    c.authorLogin
                ] || 0) + 1;
        });

        const values =
            Object.values(
                contributorMap,
            );

        const total =
            values.reduce(
                (a, b) => a + b,
                0,
            );

        const highest =
            Math.max(...values);

        const concentration =
            (highest / total) * 100;

        if (
            concentration > 70
        ) {

            insights.push(
                'Contributor concentration risk detected.',
            );
        }
    }
}