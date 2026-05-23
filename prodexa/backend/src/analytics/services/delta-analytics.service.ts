/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class DeltaAnalyticsService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) {}

    async getProjectDeltas(
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
                        date: 'desc',
                    },

                    take: 2,
                });

        if (snapshots.length < 2) {

            return {

                healthDelta: 0,

                commitDelta: 0,

                prDelta: 0,

                velocityDelta: 0,
            };
        }

        const current =
            snapshots[0];

        const previous =
            snapshots[1];

        return {

            healthDelta:
                this.calculateDelta(
                    current.commitVelocity || 0,
                    previous.commitVelocity || 0,
                ),

            commitDelta:
                this.calculateDelta(
                    current.totalCommits,
                    previous.totalCommits,
                ),

            prDelta:
                this.calculateDelta(
                    current.totalPullRequests,
                    previous.totalPullRequests,
                ),

            velocityDelta:
                this.calculateDelta(
                    current.commitVelocity || 0,
                    previous.commitVelocity || 0,
                ),
        };
    }

    private calculateDelta(
        current: number,
        previous: number,
    ) {

        if (previous === 0)
            return 0;

        return Number(
            (
                ((current - previous) /
                    previous) * 100
            ).toFixed(1),
        );
    }
}