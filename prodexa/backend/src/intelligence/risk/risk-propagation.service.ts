/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

@Injectable()
export class RiskPropagationService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async analyzeRiskPropagation() {

        const recentAnalyses =
            await this.prisma
                .commitImpactAnalysis
                .findMany({

                    take: 100,

                    orderBy: {
                        createdAt: 'desc',
                    },

                    include: {
                        commit: {
                            include: {
                                fileChanges: true,
                            },
                        },
                    },
                });

        const subsystemRiskMap:
            Record<string, any> = {};

        for (const analysis of recentAnalyses) {

            const files =
                analysis.commit
                    ?.fileChanges || [];

            for (const file of files) {

                const subsystem =
                    this.detectSubsystem(
                        file.filename,
                    );

                if (
                    !subsystemRiskMap[subsystem]
                ) {

                    subsystemRiskMap[subsystem] = {

                        subsystem,

                        totalRisk: 0,

                        commits: 0,

                        filesChanged: 0,

                        highRiskCommits: 0,

                        instabilitySignals: [],
                    };
                }

                const target =
                    subsystemRiskMap[subsystem];

                target.totalRisk +=
                    analysis.riskScore;

                target.commits += 1;

                target.filesChanged += 1;

                if (
                    analysis.riskScore >= 60
                ) {

                    target.highRiskCommits += 1;

                    target.instabilitySignals
                        .push(
                            `High-risk commit detected in ${subsystem}`,
                        );
                }
            }
        }

        const results =
            Object.values(subsystemRiskMap)
                .map((item: any) => {

                    const averageRisk =
                        item.totalRisk /
                        Math.max(
                            1,
                            item.commits,
                        );

                    const propagatedRisk =
                        this.calculatePropagatedRisk(
                            averageRisk,
                            item.highRiskCommits,
                            item.filesChanged,
                        );

                    return {

                        subsystem:
                            item.subsystem,

                        averageRisk:
                            Math.round(
                                averageRisk,
                            ),

                        propagatedRisk,

                        commits:
                            item.commits,

                        highRiskCommits:
                            item.highRiskCommits,

                        filesChanged:
                            item.filesChanged,

                        severity:
                            this.getSeverity(
                                propagatedRisk,
                            ),

                        instabilitySignals:
                            [
                                ...new Set(
                                    item.instabilitySignals,
                                ),
                            ],
                    };
                });

        results.sort(
            (a, b) =>
                b.propagatedRisk -
                a.propagatedRisk,
        );

        return {

            totalSubsystems:
                results.length,

            subsystems:
                results,
        };
    }

    private detectSubsystem(
        filename: string,
    ) {

        const lower =
            filename.toLowerCase();

        if (
            lower.includes('auth') ||
            lower.includes('jwt')
        ) {
            return 'SECURITY';
        }

        if (
            lower.includes('analytics')
        ) {
            return 'ANALYTICS';
        }

        if (
            lower.includes('prisma') ||
            lower.includes('migration')
        ) {
            return 'DATABASE';
        }

        if (
            lower.includes('/app/') ||
            lower.includes('/components/')
        ) {
            return 'FRONTEND';
        }

        if (
            lower.includes('/services/') ||
            lower.includes('/controllers/')
        ) {
            return 'BACKEND';
        }

        if (
            lower.includes('docker') ||
            lower.includes('deploy')
        ) {
            return 'INFRASTRUCTURE';
        }

        return 'GENERAL';
    }

    private calculatePropagatedRisk(
        avgRisk: number,
        highRiskCommits: number,
        filesChanged: number,
    ) {

        let score = avgRisk;

        score +=
            highRiskCommits * 8;

        score +=
            Math.min(
                20,
                filesChanged / 3,
            );

        return Math.min(
            100,
            Math.round(score),
        );
    }

    private getSeverity(
        score: number,
    ) {

        if (score >= 80) {
            return 'CRITICAL';
        }

        if (score >= 60) {
            return 'HIGH';
        }

        if (score >= 40) {
            return 'MEDIUM';
        }

        if (score >= 20) {
            return 'LOW';
        }

        return 'STABLE';
    }
}