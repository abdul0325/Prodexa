/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EngineeringHealthService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async calculateHealthScore(
        projectId: string,
    ) {

        const prediction =
            await this.prisma.prediction.findFirst({

                where: {
                    projectId,
                },

                orderBy: {
                    generatedAt: 'desc',
                },
            });

        if (prediction) {

            return {

                score:
                    prediction.productivityScore,

                status:
                    prediction.teamHealthStatus,

                metrics: {

                    avgImpactScore:
                        prediction.avgImpactScore,

                    avgRiskScore:
                        prediction.avgRiskScore,

                    noiseRatio:
                        prediction.noiseRatio,

                    testingRatio:
                        prediction.testingRatio,

                    hotspotCount:
                        prediction.hotspotCount,
                },

                signals: [
                    `Delivery Risk: ${prediction.deliveryRisk}`,
                ],
            };
        }

        return {

            score: 0,

            status: 'UNKNOWN',

            metrics: {},

            signals: [
                'No ML prediction available',
            ],
        };
    }

    private getHealthStatus(
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