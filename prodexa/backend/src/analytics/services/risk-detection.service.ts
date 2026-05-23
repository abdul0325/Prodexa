/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RiskDetectionService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async detectRisks(
        projectId: string,
    ) {

        const risks: any[] = [];

        await this.detectHighPRCycleTime(
            projectId,
            risks,
        );

        await this.detectLowCommitActivity(
            projectId,
            risks,
        );

        await this.detectLargePRs(
            projectId,
            risks,
        );

        return {

            totalRisks:
                risks.length,

            risks,
        };
    }

    private async detectHighPRCycleTime(
        projectId: string,
        risks: any[],
    ) {

        const avgCycle =
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
            avgCycle._avg.metricValue || 0;

        if (value > 48) {

            risks.push({

                severity: 'HIGH',

                category:
                    'DELIVERY_RISK',

                title:
                    'High PR Cycle Time',

                description:
                    `Average PR cycle time is ${value.toFixed(2)} hours`,

                recommendation:
                    'Review PR review process and reduce bottlenecks',
            });
        }
    }

    private async detectLowCommitActivity(
        projectId: string,
        risks: any[],
    ) {

        const recentCommits =
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

        if (recentCommits < 5) {

            risks.push({

                severity: 'MEDIUM',

                category:
                    'PRODUCTIVITY_RISK',

                title:
                    'Low Commit Activity',

                description:
                    'Development activity appears low this week',

                recommendation:
                    'Investigate contributor workload and sprint planning',
            });
        }
    }

    private async detectLargePRs(
        projectId: string,
        risks: any[],
    ) {

        const largePRs =
            await this.prisma.pullRequestEvent.findMany({

                where: {

                    repositoryId:
                        projectId,

                    additions: {
                        gt: 1000,
                    },
                },

                take: 5,
            });

        if (largePRs.length > 0) {

            risks.push({

                severity: 'MEDIUM',

                category:
                    'CODE_QUALITY_RISK',

                title:
                    'Large Pull Requests Detected',

                description:
                    `${largePRs.length} oversized PRs detected`,

                recommendation:
                    'Encourage smaller incremental PRs',
            });
        }
    }
}