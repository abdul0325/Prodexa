/* eslint-disable prettier/prettier */
import { Injectable }
    from '@nestjs/common';

import { PrismaService }
    from '../prisma/prisma.service';

@Injectable()

export class ManagerService {

    constructor(

        private prisma:
            PrismaService,
    ) { }

    private calculateProjectHealth(
        project: any,
    ): number {

        if (
            !project.developerActivities?.length
        ) {
            return 0;
        }

        const total =
            project.developerActivities.reduce(

                (
                    sum: number,
                    dev: any,
                ) => {

                    return (
                        sum +
                        (
                            dev.productivityScore ||
                            0
                        )
                    );
                },

                0,
            );

        return Math.round(
            total /
            project.developerActivities.length,
        );
    }

    async getOverview(
        userId: string,
    ) {

        /* PROJECTS */

        const projects =
            await this.prisma.project
                .findMany({

                    where: {
                        userId,
                    },

                    include: {

                        developerActivities: true,
                    },
                });

        /* KPI COUNTS */

        const totalProjects =
            projects.length;

        const healthyProjects =
            projects.filter(
                (project) =>
                    this.calculateProjectHealth(
                        project,
                    ) >= 70,
            ).length;

        const highRiskProjects =
            projects.filter(
                (project) =>
                    this.calculateProjectHealth(
                        project,
                    ) < 40,
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
                        dev.entries,
                    ),
            }));

        /* TOTAL DEVELOPERS */

        const totalDevelopers =
            developers.length;

        /* PROJECT TABLE */

        const projectsData =
            projects.map((project) => ({

                id: project.id,

                name: project.name,

                healthScore:
                    this.calculateProjectHealth(project),

                risk:
                    this.calculateProjectHealth(project) < 40
                        ? 'High'
                        : 'Low',

                developersCount:
                    project.developerActivities
                        .length,

                status:
                    project.status,
            }));

        /* RISKS */

        const risks: {

            type: string;

            title: string;

            message: string;

        }[] = [];

        for (const project of projects) {

            if (
                this.calculateProjectHealth(project) < 40
            ) {

                risks.push({

                    type: 'PROJECT',

                    title:
                        project.name,

                    message:
                        'High delivery risk detected',
                });
            }
        }

        for (
            const developer
            of developers
        ) {

            if (
                developer.averageProductivity
                < 40
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

        /* RESPONSE */

        return {

            kpis: {

                totalProjects,

                healthyProjects,

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