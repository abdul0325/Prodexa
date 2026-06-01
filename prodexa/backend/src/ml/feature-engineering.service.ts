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
        projectId: string,
    ) {
        const project =
            await this.prisma.project.findUnique({
                where: {
                    id: projectId,
                },
                include: {
                    repository: true,
                },
            });

        if (!project?.repository) {
            throw new Error(
                `Repository not linked to project ${projectId}`,
            );
        }

        const repositoryId =
            project.repository.githubId;
            
            console.log(
            'FEATURE ENGINEERING',
            {
                projectId,
                repositoryId,
            },
        );

        // Get repository commits first
        const commits =
            await this.prisma.commitEvent.findMany({
                where: {
                    repositoryId,
                },
                select: {
                    sha: true,
                },
                take: 100,
                orderBy: {
                    committedAt: 'desc',
                },
            });

        const commitShas =
            commits.map(
                commit => commit.sha,
            );

        const [
            impacts,
            pullRequests,
            fileChanges,
        ] = await Promise.all([

            this.prisma.commitImpactAnalysis.findMany({
                where: {
                    commitSha: {
                        in: commitShas,
                    },
                },
            }),

            this.prisma.pullRequestEvent.findMany({
                where: {
                    repositoryId,
                },
                take: 100,
            }),

            this.prisma.commitFileChange.findMany({
                where: {
                    commitSha: {
                        in: commitShas,
                    },
                },
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
                    i => i.meaningfulnessScore,
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

        // NOISE

        const lowValueCommits =
            impacts.filter(
                i => i.impactLevel === 'MINIMAL',
            ).length;

        const noiseRatio =
            totalCommits > 0
                ? lowValueCommits / totalCommits
                : 0;

        // TESTING

        const testingChanges =
            fileChanges.filter(
                file => file.isTestFile,
            ).length;

        const testingRatio =
            fileChanges.length > 0
                ? testingChanges / fileChanges.length
                : 0;

        // ENGINEERING SURFACES

        const backendChanges =
            fileChanges.filter(
                file =>
                    file.filename.includes('/services/') ||
                    file.filename.includes('/controllers/') ||
                    file.filename.includes('/repositories/') ||
                    file.filename.includes('/modules/'),
            ).length;

        const frontendChanges =
            fileChanges.filter(
                file =>
                    file.filename.includes('/app/') ||
                    file.filename.includes('/components/') ||
                    file.filename.includes('/pages/') ||
                    file.filename.includes('/hooks/'),
            ).length;

        const infraChanges =
            fileChanges.filter(
                file =>
                    file.filename.toLowerCase().includes('docker') ||
                    file.filename.toLowerCase().includes('deploy') ||
                    file.filename.toLowerCase().includes('terraform') ||
                    file.filename.toLowerCase().includes('kubernetes') ||
                    file.filename.toLowerCase().includes('github/workflows'),
            ).length;

        const securityChanges =
            fileChanges.filter(
                file =>
                    file.filename.toLowerCase().includes('auth') ||
                    file.filename.toLowerCase().includes('jwt') ||
                    file.filename.toLowerCase().includes('security') ||
                    file.filename.toLowerCase().includes('permission'),
            ).length;

        // HOTSPOTS

        const fileFrequency:
            Record<string, number> = {};

        for (const file of fileChanges) {

            fileFrequency[file.filename] =
                (fileFrequency[file.filename] || 0) + 1;
        }

        const hotspotCount =
            Object.values(fileFrequency)
                .filter(
                    count => count >= 5,
                )
                .length;

        const hotspotRatio =
            totalCommits > 0
                ? hotspotCount / totalCommits
                : 0;

        const testingCoverage =
            fileChanges.length > 0
                ? testingChanges / fileChanges.length
                : 0;

        const backendRiskRatio =
            backendChanges > 0
                ? securityChanges / backendChanges
                : 0;

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

            hotspotRatio,

            testingCoverage,

            backendRiskRatio,
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