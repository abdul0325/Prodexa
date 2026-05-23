/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
from 'src/prisma/prisma.service';

@Injectable()
export class FeatureEngineeringService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async generateProjectFeatures(
        repositoryId: string,
    ) {

        const [
            impacts,
            commits,
            pullRequests,
            fileChanges,
        ] = await Promise.all([

            this.prisma
                .commitImpactAnalysis
                .findMany({

                    take: 100,

                    orderBy: {
                        createdAt: 'desc',
                    },
                }),

            this.prisma
                .commitEvent
                .findMany({

                    where: {
                        repositoryId,
                    },

                    take: 100,
                }),

            this.prisma
                .pullRequestEvent
                .findMany({

                    where: {
                        repositoryId,
                    },

                    take: 100,
                }),

            this.prisma
                .commitFileChange
                .findMany({

                    take: 300,
                }),
        ]);

        // BASIC COUNTS

        const totalCommits =
            commits.length;

        const totalPRs =
            pullRequests.length;

        // IMPACT FEATURES

        const avgImpactScore =
            this.average(
                impacts.map(
                    i => i.impactScore,
                ),
            );

        const avgRiskScore =
            this.average(
                impacts.map(
                    i => i.riskScore,
                ),
            );

        const avgMeaningfulness =
            this.average(
                impacts.map(
                    i =>
                        i.meaningfulnessScore,
                ),
            );

        // RISK FEATURES

        const riskyCommits =
            impacts.filter(
                i => i.riskScore >= 70,
            ).length;

        const highImpactCommits =
            impacts.filter(
                i => i.impactScore >= 70,
            ).length;

        // LOW VALUE / NOISE

        const lowValueCommits =
            impacts.filter(
                i =>
                    i.impactLevel ===
                    'MINIMAL',
            ).length;

        const noiseRatio =
            totalCommits > 0
                ? lowValueCommits /
                totalCommits
                : 0;

        // TESTING SIGNALS

        const testingChanges =
            fileChanges.filter(
                file =>
                    file.isTestFile,
            ).length;

        const testingRatio =
            fileChanges.length > 0
                ? testingChanges /
                fileChanges.length
                : 0;

        // ENGINEERING SURFACES

        const backendChanges =
            fileChanges.filter(
                file =>
                    file.filename.includes(
                        '/services/',
                    ) ||
                    file.filename.includes(
                        '/controllers/',
                    ),
            ).length;

        const frontendChanges =
            fileChanges.filter(
                file =>
                    file.filename.includes(
                        '/app/',
                    ) ||
                    file.filename.includes(
                        '/components/',
                    ),
            ).length;

        const infraChanges =
            fileChanges.filter(
                file =>
                    file.filename.includes(
                        'docker',
                    ) ||
                    file.filename.includes(
                        'deploy',
                    ),
            ).length;

        const securityChanges =
            fileChanges.filter(
                file =>
                    file.filename.includes(
                        'auth',
                    ) ||
                    file.filename.includes(
                        'jwt',
                    ),
            ).length;

        // HOTSPOTS

        const fileFrequency:
            Record<string, number> = {};

        for (const file of fileChanges) {

            fileFrequency[
                file.filename
            ] =
                (
                    fileFrequency[
                        file.filename
                    ] || 0
                ) + 1;
        }

        const hotspotCount =
            Object.values(
                fileFrequency,
            ).filter(
                count => count >= 5,
            ).length;

        // FINAL VECTOR

        return {

            repositoryId,

            totalCommits,

            totalPRs,

            avgImpactScore,

            avgRiskScore,

            avgMeaningfulness,

            riskyCommits,

            highImpactCommits,

            lowValueCommits,

            noiseRatio,

            testingRatio,

            backendChanges,

            frontendChanges,

            infraChanges,

            securityChanges,

            hotspotCount,
        };
    }

    private average(
        values: number[],
    ) {

        if (!values.length) {
            return 0;
        }

        return (
            values.reduce(
                (a, b) => a + b,
                0,
            ) / values.length
        );
    }
}