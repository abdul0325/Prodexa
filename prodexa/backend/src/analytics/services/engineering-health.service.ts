/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EngineeringHealthService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async calculateHealthScore(
        projectId: string,
    ) {

        const [
            avgPRCycleTime,
            totalCommits,
            openPRs,
            recentCommits,
        ] = await Promise.all([

            this.prisma.engineeringKPI.aggregate({

                where: {

                    metricName:
                        'PR_CYCLE_TIME_HOURS',

                    repositoryId:
                        projectId,
                },

                _avg: {
                    metricValue: true,
                },
            }),

            this.prisma.commitEvent.count({

                where: {
                    repositoryId:
                        projectId,
                },
            }),

            this.prisma.pullRequestEvent.count({
                where: {

                    repositoryId:
                        projectId,

                    state: 'open',
                },
            }),

            this.prisma.commitEvent.count({
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
            }),
        ]);

        const signals: string[] = [];

        let score = 100;

        const prCycleTime =
            avgPRCycleTime._avg.metricValue || 0;

        if (prCycleTime > 48) {

            score -= 25;

            signals.push(
                'PR cycle time is very high',
            );
        }

        if (openPRs > 20) {

            score -= 15;

            signals.push(
                'Too many open pull requests',
            );
        }

        if (recentCommits < 5) {

            score -= 20;

            signals.push(
                'Low development activity detected',
            );
        }

        if (signals.length === 0) {

            signals.push(
                'Engineering health looks stable',
            );
        }

        return {

            score,

            status:
                this.getHealthStatus(score),

            metrics: {

                averagePRCycleTime:
                    prCycleTime,

                totalCommits,

                openPRs,

                recentCommits,
            },

            signals,
        };
    }

    private getHealthStatus(
        score: number,
    ) {

        if (score >= 85) {
            return 'EXCELLENT';
        }

        if (score >= 70) {
            return 'GOOD';
        }

        if (score >= 50) {
            return 'WARNING';
        }

        return 'CRITICAL';
    }
}