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

        const healthTrend =
            snapshots.map(s => ({

                date: s.date,

                health:
                    s.healthScore || 0,

                commits:
                    s.totalCommits || 0,

                prs:
                    s.totalPullRequests || 0,

                mergedPRs:
                    s.mergedPullRequests || 0,

                issues:
                    s.totalIssues || 0,

                closedIssues:
                    s.closedIssues || 0,

                contributors:
                    s.activeContributors || 0,

                velocity:
                    s.commitVelocity || 0,

                averagePRMergeTime:
                    s.averagePRMergeTime || 0,

                daysSinceStart:
                    s.daysSinceStart || 0,
            }));

        const commitTrend =
            snapshots.map(s => ({

                date: s.date,

                commits:
                    s.totalCommits || 0,
            }));

        const prTrend =
            snapshots.map(s => ({

                date: s.date,

                prs:
                    s.totalPullRequests || 0,

                mergedPRs:
                    s.mergedPullRequests || 0,
            }));

        const velocityTrend =
            snapshots.map(s => ({

                date: s.date,

                velocity:
                    s.commitVelocity || 0,
            }));

        const contributorsTrend =
            snapshots.map(s => ({

                date: s.date,

                contributors:
                    s.activeContributors || 0,
            }));

        const issueTrend =
            snapshots.map(s => ({

                date: s.date,

                totalIssues:
                    s.totalIssues || 0,

                closedIssues:
                    s.closedIssues || 0,
            }));

        const mergeTrend =
            snapshots.map(s => ({

                date: s.date,

                mergedPRs:
                    s.mergedPullRequests || 0,

                averagePRMergeTime:
                    s.averagePRMergeTime || 0,
            }));

        return {

            healthTrend,

            commitTrend,

            prTrend,

            velocityTrend,

            contributorsTrend,

            issueTrend,

            mergeTrend,
        };
    }
}