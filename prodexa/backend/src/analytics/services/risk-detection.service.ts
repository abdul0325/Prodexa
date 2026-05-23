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

        // Get project to find repositoryId
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { repository: true },
        });

        if (!project?.repository) {
            return this.getDefaultResponse();
        }

        const repositoryId = project.repository.githubId;

        // Get latest snapshot
        const latestSnapshot =
            await this.prisma.dailyMetricsSnapshot.findFirst({

                where: {
                    projectId,
                },

                orderBy: {
                    date: 'desc',
                },
            });

        if (!latestSnapshot) {
            return this.getDefaultResponse();
        }

        // Calculate real risk metrics
        const noiseRatio = await this.calculateNoiseRatio(repositoryId);
        const testingRatio = await this.calculateTestingRatio(repositoryId);
        const hotspotCount = await this.calculateHotspotCount(repositoryId);
        const avgRiskScore = this.calculateOverallRiskScore(
            latestSnapshot,
            noiseRatio,
            testingRatio,
            hotspotCount,
        );

        const deliveryRisk = this.getDeliveryRiskLevel(avgRiskScore);
        const reasons = this.generateRiskReasons(
            latestSnapshot,
            noiseRatio,
            testingRatio,
            hotspotCount,
            avgRiskScore,
        );

        return {

            deliveryRisk,

            signals: {

                noiseRatio,
                testingRatio,
                hotspotCount,
                avgRiskScore,
            },

            reasons,
        };
    }

    private getDefaultResponse() {

        return {

            deliveryRisk: 'LOW',

            signals: {

                noiseRatio: 0,
                testingRatio: 0,
                hotspotCount: 0,
                avgRiskScore: 0,
            },

            reasons: [],
        };
    }

    private async calculateNoiseRatio(
        repositoryId: string,
    ): Promise<number> {

        // Calculate ratio of non-meaningful commits (small changes, refactors)
        const recentCommits =
            await this.prisma.commitEvent.findMany({

                where: {
                    repositoryId,
                    committedAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },

                include: {
                    impactAnalysis: true,
                },

                take: 100,
            });

        if (recentCommits.length === 0) return 0;

        const meaningfulCommits =
            recentCommits.filter(
                (c) =>
                    c.impactAnalysis &&
                    c.impactAnalysis.meaningfulnessScore > 50,
            ).length;

        const noiseRatio =
            1 - meaningfulCommits / recentCommits.length;

        return Math.round(noiseRatio * 100);
    }

    private async calculateTestingRatio(
        repositoryId: string,
    ): Promise<number> {

        // Calculate ratio of test-related commits
        const recentCommits =
            await this.prisma.commitEvent.findMany({

                where: {
                    repositoryId,
                    committedAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },

                include: {
                    fileChanges: true,
                },

                take: 100,
            });

        if (recentCommits.length === 0) return 0;

        let testFileCount = 0;
        let totalFileCount = 0;

        for (const commit of recentCommits) {
            for (const fileChange of commit.fileChanges) {
                totalFileCount++;
                if (fileChange.isTestFile) {
                    testFileCount++;
                }
            }
        }

        const testingRatio =
            totalFileCount > 0 ? testFileCount / totalFileCount : 0;

        return Math.round(testingRatio * 100);
    }

    private async calculateHotspotCount(
        repositoryId: string,
    ): Promise<number> {

        // Count files with high churn (frequent changes)
        const recentCommits =
            await this.prisma.commitEvent.findMany({

                where: {
                    repositoryId,
                    committedAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },

                include: {
                    fileChanges: true,
                },

                take: 100,
            });

        const fileChangeCount = new Map<string, number>();

        for (const commit of recentCommits) {
            for (const fileChange of commit.fileChanges) {
                const count =
                    fileChangeCount.get(fileChange.filename) || 0;
                fileChangeCount.set(
                    fileChange.filename,
                    count + 1,
                );
            }
        }

        // Files changed more than 5 times in 30 days are hotspots
        const hotspotCount = Array.from(
            fileChangeCount.values(),
        ).filter((count) => count > 5).length;

        return hotspotCount;
    }

    private calculateOverallRiskScore(
        snapshot: any,
        noiseRatio: number,
        testingRatio: number,
        hotspotCount: number,
    ): number {

        let riskScore = 0;

        // Health score component (inverse relationship)
        const healthScore = snapshot.healthScore || 0;
        riskScore += (100 - healthScore) * 0.3;

        // Noise ratio component
        riskScore += noiseRatio * 0.2;

        // Testing ratio component (inverse)
        riskScore += (100 - testingRatio) * 0.15;

        // Hotspot count component
        riskScore += Math.min(hotspotCount * 10, 100) * 0.2;

        // Merge rate component
        const mergeRate =
            snapshot.totalPullRequests > 0
                ? (snapshot.mergedPullRequests /
                      snapshot.totalPullRequests) *
                  100
                : 0;
        riskScore += (100 - mergeRate) * 0.15;

        return Math.round(Math.min(100, riskScore));
    }

    private getDeliveryRiskLevel(
        riskScore: number,
    ): string {

        if (riskScore >= 70) return 'HIGH';
        if (riskScore >= 40) return 'MEDIUM';
        return 'LOW';
    }

    private generateRiskReasons(
        snapshot: any,
        noiseRatio: number,
        testingRatio: number,
        hotspotCount: number,
        riskScore: number,
    ): string[] {

        const reasons: string[] = [];

        if (noiseRatio > 50) {
            reasons.push(
                `High noise ratio detected (${noiseRatio}% of commits may be non-meaningful)`,
            );
        }

        if (testingRatio < 20) {
            reasons.push(
                `Low test coverage detected (${testingRatio}% of files are test files)`,
            );
        }

        if (hotspotCount > 5) {
            reasons.push(
                `${hotspotCount} code hotspots identified with high churn rate`,
            );
        }

        const mergeRate =
            snapshot.totalPullRequests > 0
                ? (snapshot.mergedPullRequests /
                      snapshot.totalPullRequests) *
                  100
                : 0;

        if (mergeRate < 50) {
            reasons.push(
                `Low PR merge rate (${mergeRate.toFixed(1)}%) indicating potential bottlenecks`,
            );
        }

        if (snapshot.activeContributors < 2) {
            reasons.push(
                'Low contributor count creating single point of failure risk',
            );
        }

        if (snapshot.commitVelocity < 1) {
            reasons.push(
                'Very low commit velocity indicating stalled development',
            );
        }

        return reasons;
    }
}