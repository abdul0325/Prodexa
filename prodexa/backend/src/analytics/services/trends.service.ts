/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

@Injectable()
export class TrendsService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async getProjectTrends(
        projectId: string,
    ) {

        const snapshots =
            await this.prisma
                .dailyMetricsSnapshot
                .findMany({

                    where: {
                        projectId,
                    },

                    orderBy: {
                        date: 'asc',
                    },

                    take: 30,
                });

        return {

            healthTrend:
                snapshots.map(s => ({

                    date: s.date,

                    health:
                        s.commitVelocity ||

                        s.totalCommits ||

                        0,

                    commits:
                        s.totalCommits || 0,

                    prs:
                        s.totalPullRequests || 0,
                })),

            commitTrend:
                snapshots.map(s => ({

                    date: s.date,

                    commits:
                        s.totalCommits,
                })),

            prTrend:
                snapshots.map(s => ({

                    date: s.date,

                    prs:
                        s.totalPullRequests,
                })),

            velocityTrend:
                snapshots.map(s => ({

                    date: s.date,

                    velocity:
                        s.commitVelocity || 0,
                })),
        };
    }
}