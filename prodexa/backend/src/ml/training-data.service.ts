/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

import { FeatureEngineeringService }
    from './feature-engineering.service';

@Injectable()
export class TrainingDataService {

    constructor(

        private readonly prisma:
            PrismaService,

        private readonly featureEngineering:
            FeatureEngineeringService,
    ) { }

    async generateDataset() {

        const projects =
            await this.prisma.project
                .findMany();

        const dataset: Record<string, any>[] = [];

        for (const project of projects) {

            const features =
                await this.featureEngineering
                    .generateProjectFeatures(
                        project.id,
                    );

            // SIMPLE LABELING LOGIC

            let deliveryRisk = 0;

            if (
                features.avgRiskScore >= 70
            ) {

                deliveryRisk = 2;
            }

            else if (
                features.avgRiskScore >= 40
            ) {

                deliveryRisk = 1;
            }

            dataset.push({

                ...features,

                label_deliveryRisk:
                    deliveryRisk,

                label_engineeringHealth:
                    Math.max(
                        0,
                        100 -
                        features.avgRiskScore,
                    ),
            });
        }

        return dataset;
    }
}