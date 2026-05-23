/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

@Injectable()
export class EngineeringHealthV2Service {

    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async calculateHealth() {

        const [
            recentImpacts,
            recentHotspots,
        ] = await Promise.all([

            this.prisma
                .commitImpactAnalysis
                .findMany({

                    take: 50,

                    orderBy: {
                        createdAt: 'desc',
                    },
                }),

            this.prisma
                .commitFileChange
                .groupBy({

                    by: ['filename'],

                    _count: {
                        filename: true,
                    },

                    orderBy: {
                        _count: {
                            filename: 'desc',
                        },
                    },

                    take: 10,
                }),
        ]);

        let score = 100;

        const signals: string[] = [];

        // ─────────────────────────────
        // MEANINGFUL WORK
        // ─────────────────────────────

        const meaningfulCommits =
            recentImpacts.filter(
                impact =>
                    impact.meaningfulnessScore >= 50,
            );

        if (
            meaningfulCommits.length >= 10
        ) {

            score += 5;

            signals.push(
                'Consistent meaningful engineering activity detected',
            );
        }

        // ─────────────────────────────
        // HIGH RISK COMMITS
        // ─────────────────────────────

        const riskyCommits =
            recentImpacts.filter(
                impact =>
                    impact.riskScore >= 70,
            );

        if (
            riskyCommits.length >= 5
        ) {

            score -= 25;

            signals.push(
                'Elevated high-risk engineering activity detected',
            );
        }

        // ─────────────────────────────
        // LOW VALUE CHURN
        // ─────────────────────────────

        const lowValueCommits =
            recentImpacts.filter(
                impact =>
                    impact.impactLevel ===
                    'MINIMAL',
            );

        if (
            lowValueCommits.length >= 10
        ) {

            score -= 15;

            signals.push(
                'High volume of low-value engineering activity',
            );
        }

        // ─────────────────────────────
        // HOTSPOT INSTABILITY
        // ─────────────────────────────

        const unstableFiles =
            recentHotspots.filter(
                file =>
                    file._count.filename >= 8,
            );

        if (
            unstableFiles.length >= 3
        ) {

            score -= 20;

            signals.push(
                'Engineering hotspots show elevated instability',
            );
        }

        // ─────────────────────────────
        // TESTING SIGNALS
        // ─────────────────────────────

        const testingSignals =
            recentImpacts.filter(
                impact => {

                    const reasons =
                        impact.reasons as string[];

                    return reasons?.some(
                        reason =>
                            reason.includes(
                                'Test coverage',
                            ),
                    );
                },
            );

        if (
            testingSignals.length >= 5
        ) {

            score += 10;

            signals.push(
                'Healthy testing-related engineering activity detected',
            );
        }

        // ─────────────────────────────
        // SCORE NORMALIZATION
        // ─────────────────────────────

        score =
            Math.max(
                0,
                Math.min(100, score),
            );

        return {

            score,

            status:
                this.getStatus(score),

            signals,

            metrics: {

                meaningfulCommits:
                    meaningfulCommits.length,

                riskyCommits:
                    riskyCommits.length,

                lowValueCommits:
                    lowValueCommits.length,

                unstableFiles:
                    unstableFiles.length,

                testingSignals:
                    testingSignals.length,
            },
        };
    }

    private getStatus(
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