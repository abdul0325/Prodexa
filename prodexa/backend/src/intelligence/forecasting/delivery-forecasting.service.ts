/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

@Injectable()
export class DeliveryForecastingService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async generateForecast() {

        const recentImpacts =
            await this.prisma
                .commitImpactAnalysis
                .findMany({

                    take: 50,

                    orderBy: {
                        createdAt: 'desc',
                    },
                });

        let deliveryRisk = 0;

        const signals: string[] = [];

        // ─────────────────────────────
        // HIGH RISK ACTIVITY
        // ─────────────────────────────

        const riskyCommits =
            recentImpacts.filter(
                item =>
                    item.riskScore >= 70,
            );

        if (riskyCommits.length >= 5) {

            deliveryRisk += 30;

            signals.push(
                'Repeated high-risk engineering activity detected',
            );
        }

        // ─────────────────────────────
        // LOW VALUE ENGINEERING
        // ─────────────────────────────

        const lowValue =
            recentImpacts.filter(
                item =>
                    item.impactLevel ===
                    'MINIMAL',
            );

        if (lowValue.length >= 10) {

            deliveryRisk += 15;

            signals.push(
                'Large volume of low-value engineering activity',
            );
        }

        // ─────────────────────────────
        // TESTING COVERAGE SIGNAL
        // ─────────────────────────────

        const testingSignals =
            recentImpacts.filter(
                item => {

                    const reasons =
                        item.reasons as string[];

                    return reasons?.some(
                        reason =>
                            reason.includes(
                                'Test coverage',
                            ),
                    );
                },
            );

        if (testingSignals.length <= 2) {

            deliveryRisk += 20;

            signals.push(
                'Low testing activity detected',
            );
        }

        // ─────────────────────────────
        // HIGH MEANINGFUL CHANGES
        // ─────────────────────────────

        const meaningful =
            recentImpacts.filter(
                item =>
                    item.meaningfulnessScore >= 60,
            );

        if (meaningful.length >= 10) {

            deliveryRisk -= 15;

            signals.push(
                'Consistent meaningful engineering progress detected',
            );
        }

        // ─────────────────────────────
        // NORMALIZE
        // ─────────────────────────────

        deliveryRisk =
            Math.max(
                0,
                Math.min(100, deliveryRisk),
            );

        return {

            deliveryRisk,

            forecast:
                this.getForecast(
                    deliveryRisk,
                ),

            severity:
                this.getSeverity(
                    deliveryRisk,
                ),

            signals,
        };
    }

    private getForecast(
        risk: number,
    ) {

        if (risk >= 80) {

            return [
                'High probability of delivery slowdown',
                'Elevated regression risk',
                'Subsystem instability likely to increase',
            ];
        }

        if (risk >= 60) {

            return [
                'Moderate delivery pressure detected',
                'Engineering instability increasing',
            ];
        }

        if (risk >= 40) {

            return [
                'Engineering activity stable with mild delivery risk',
            ];
        }

        return [
            'Engineering delivery forecast appears stable',
        ];
    }

    private getSeverity(
        risk: number,
    ) {

        if (risk >= 80) {
            return 'CRITICAL';
        }

        if (risk >= 60) {
            return 'HIGH';
        }

        if (risk >= 40) {
            return 'MEDIUM';
        }

        return 'LOW';
    }
}