/* eslint-disable prettier/prettier */
import { Injectable }
    from '@nestjs/common';

import { PrismaService }
    from '../prisma/prisma.service';

@Injectable()
export class ManagerService {

    constructor(
        private prisma: PrismaService,
    ) { }

    private getLatestHealthScore(
        project: any,
    ): number {

        return (
            project.dailyMetricsSnapshots?.[0]
                ?.healthScore ?? 0
        );
    }

    async getOverview(
        userId: string,
    ) {
        console.log(
            'MANAGER USER ID:',
            userId,
        );
        const projects =
    await this.prisma.project.findMany({

        include: {
            developerActivities: true,
            dailyMetricsSnapshots: {
                orderBy: {
                    date: 'desc',
                },
                take: 1,
            },
        },
    });
        console.log(
            'PROJECTS FOUND:',
            projects.length,
        );
        /* KPI COUNTS */

        const totalProjects =
            projects.length;

        const healthyProjects =
            projects.filter(
                p =>
                    this.getLatestHealthScore(p) >= 70,
            ).length;

        const mediumRiskProjects =
            projects.filter(p => {

                const health =
                    this.getLatestHealthScore(p);

                return (
                    health >= 40 &&
                    health < 70
                );
            }).length;

        const highRiskProjects =
            projects.filter(
                p =>
                    this.getLatestHealthScore(p) < 40,
            ).length;

        /* DEVELOPER AGGREGATION */

        const developersMap =
            new Map();

        for (const project of projects) {

            for (
                const dev
                of project.developerActivities
            ) {

                const key =
                    dev.developerLogin;

                if (
                    !developersMap.has(key)
                ) {

                    developersMap.set(
                        key,
                        {

                            developerLogin:
                                key,

                            avatarUrl:
                                dev.avatarUrl,

                            projects:
                                new Set(),

                            totalCommits: 0,

                            totalProductivity: 0,

                            entries: 0,
                        },
                    );
                }

                const existing =
                    developersMap.get(key);

                existing.projects.add(
                    project.id,
                );

                existing.totalCommits +=
                    dev.commits || 0;

                existing.totalProductivity +=
                    dev.productivityScore || 0;

                existing.entries += 1;
            }
        }

        const developers =
            Array.from(
                developersMap.values(),
            ).map((dev: any) => ({

                developerLogin:
                    dev.developerLogin,

                avatarUrl:
                    dev.avatarUrl,

                projectsCount:
                    dev.projects.size,

                totalCommits:
                    dev.totalCommits,

                averageProductivity:
                    Math.round(
                        dev.totalProductivity /
                        Math.max(
                            dev.entries,
                            1,
                        ),
                    ),
            }));

        const totalDevelopers =
            developers.length;

        /* PROJECT TABLE */

        const projectsData =
            projects.map(project => {

                const snapshot =
                    project.dailyMetricsSnapshots?.[0];

                const health =
                    snapshot?.healthScore ?? null;

                return {

                    id:
                        project.id,

                    name:
                        project.name,

                    status:
                        project.status,

                    healthScore:
                        health,

                    totalCommits:
                        snapshot?.totalCommits || 0,

                    commitVelocity:
                        snapshot?.commitVelocity || 0,

                    activeContributors:
                        snapshot?.activeContributors || 0,

                    totalPullRequests:
                        snapshot?.totalPullRequests || 0,

                    mergedPullRequests:
                        snapshot?.mergedPullRequests || 0,

                    averagePRMergeTime:
                        snapshot?.averagePRMergeTime || 0,

                    risk:
                        !snapshot
                            ? 'Unknown'
                            : health! < 40
                                ? 'High'
                                : health! < 70
                                    ? 'Medium'
                                    : 'Low',
                };
            });

        projectsData.sort(
            (a, b) =>
                (a.healthScore ?? 0) -
                (b.healthScore ?? 0),
        );

        /* RISKS */

        const risks: {

            type: string;

            title: string;

            message: string;

        }[] = [];

        for (const project of projects) {

            const snapshot =
                project.dailyMetricsSnapshots?.[0];

            if (!snapshot)
                continue;

            if (
                snapshot.healthScore < 40
            ) {

                risks.push({

                    type: 'PROJECT',

                    title:
                        project.name,

                    message:
                        `Health score critically low (${snapshot.healthScore})`,
                });
            }

            if (
                snapshot.commitVelocity === 0
            ) {

                risks.push({

                    type: 'PROJECT',

                    title:
                        project.name,

                    message:
                        'No commits recorded today',
                });
            }

            if (
                snapshot.activeContributors <= 1
            ) {

                risks.push({

                    type: 'PROJECT',

                    title:
                        project.name,

                    message:
                        'Single contributor dependency detected',
                });
            }

            if (
                snapshot.averagePRMergeTime &&
                snapshot.averagePRMergeTime > 72
            ) {

                risks.push({

                    type: 'PROJECT',

                    title:
                        project.name,

                    message:
                        `Slow review cycle (${Math.round(snapshot.averagePRMergeTime)}h average merge time)`,
                });
            }
        }

        for (
            const developer
            of developers
        ) {

            if (
                developer.averageProductivity < 40
            ) {

                risks.push({

                    type: 'DEVELOPER',

                    title:
                        developer.developerLogin,

                    message:
                        'Low productivity detected',
                });
            }
        }

        risks.sort((a, b) => {

            if (
                a.type === 'PROJECT' &&
                b.type !== 'PROJECT'
            ) {
                return -1;
            }

            if (
                a.type !== 'PROJECT' &&
                b.type === 'PROJECT'
            ) {
                return 1;
            }

            return 0;
        });

        return {

            kpis: {

                totalProjects,

                healthyProjects,

                mediumRiskProjects,

                highRiskProjects,

                totalDevelopers,
            },

            projects:
                projectsData,

            developers,

            risks,
        };
    }
}