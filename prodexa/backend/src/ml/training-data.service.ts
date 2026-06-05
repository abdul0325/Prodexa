/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

import { FeatureEngineeringService }
    from './feature-engineering.service';

import { SyntheticDatasetService }
    from './synthetic-dataset.service';

@Injectable()
export class TrainingDataService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly featureEngineering: FeatureEngineeringService,
        private readonly syntheticDataset: SyntheticDatasetService,
    ) { }

    async generateDataset() {

        const projects =
            await this.prisma.project.findMany();

        const dataset: Record<string, any>[] = [];

        for (const project of projects) {

            const features =
                await this.featureEngineering.generateProjectFeatures(
                    project.id,
                );

            let deliveryRisk = 0;

            const riskPressure =
                features.avgRiskScore +
                (features.hotspotCount * 5) +
                (features.noiseRatio * 20);

            if (riskPressure >= 80) {

                deliveryRisk = 2;

            } else if (riskPressure >= 50) {

                deliveryRisk = 1;

            }

            const healthScore =
                (
                    (features.avgImpactScore * 0.40) +
                    ((100 - features.avgRiskScore) * 0.30) +
                    ((1 - features.noiseRatio) * 100 * 0.15) +
                    (features.testingRatio * 100 * 0.15)
                );

            const engineeringHealth =
                Math.round(
                    Math.max(
                        0,
                        Math.min(
                            100,
                            healthScore,
                        ),
                    ),
                );

            dataset.push({

                ...features,

                label_deliveryRisk:
                    deliveryRisk,

                label_engineeringHealth:
                    engineeringHealth,
            });
        }

        const synthetic =
            this.syntheticDataset.generateSamples(
                1000,
            );

        return [

            ...dataset,

            ...synthetic,
        ];
    }
}