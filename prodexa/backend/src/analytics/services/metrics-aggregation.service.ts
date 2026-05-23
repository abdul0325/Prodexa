/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

@Injectable()
export class MetricsAggregationService {

    constructor(
        private readonly prisma:
            PrismaService,
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

        const today =
            this.getStartOfDay(
                new Date(),
            );

        const projectId =
            normalizedEvent.projectId;

        /*
         * SOURCE OF TRUTH:
         * CommitEvent table
         */

        const totalCommits =
            await this.prisma
                .commitEvent
                .count({

                    where: {
                        repositoryId:
                            normalizedEvent
                                .repository
                                .id
                                .toString(),
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
                        repositoryId:
                            normalizedEvent
                                .repository
                                .id
                                .toString(),
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
                        repositoryId:
                            normalizedEvent
                                .repository
                                .id
                                .toString(),
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
         * UPSERT SNAPSHOT
         */

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
                },

                create: {

                    projectId,

                    date: today,

                    totalCommits,

                    totalPullRequests,

                    activeContributors,

                    commitVelocity,
                },
            });
    }
}