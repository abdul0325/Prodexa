/* eslint-disable prettier/prettier */

interface SyntheticSample {
    totalCommits: number;
    totalPRs: number;
    avgImpactScore: number;
    avgRiskScore: number;
    avgMeaningfulness: number;
    riskyCommits: number;
    highImpactCommits: number;
    lowValueCommits: number;
    noiseRatio: number;
    testingRatio: number;
    backendChanges: number;
    frontendChanges: number;
    infraChanges: number;
    securityChanges: number;
    hotspotCount: number;
    hotspotRatio: number;
    testingCoverage: number;
    backendRiskRatio: number;
    label_engineeringHealth: number;
    label_deliveryRisk: number;
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class SyntheticDatasetService {

    generateSamples(count = 1000) {

        const rows: SyntheticSample[] = [];

        for (let i = 0; i < count; i++) {

            const totalCommits =
                this.random(20, 2000);

            const avgImpactScore =
                this.random(10, 95);

            const avgRiskScore =
                this.random(5, 95);

            const testingRatio =
                Math.random();

            const noiseRatio =
                Math.random() * 0.8;

            const hotspotCount =
                this.random(0, 50);

            const backendChanges =
                this.random(0, 500);

            const frontendChanges =
                this.random(0, 500);

            const infraChanges =
                this.random(0, 100);

            const securityChanges =
                this.random(0, 100);

            const hotspotRatio =
                hotspotCount / Math.max(totalCommits, 1);

            const testingCoverage =
                testingRatio;

            const backendRiskRatio =
                backendChanges > 0
                    ? securityChanges / backendChanges
                    : 0;

            const healthScore =
                (
                    avgImpactScore * 0.40 +
                    (100 - avgRiskScore) * 0.30 +
                    testingRatio * 100 * 0.20 +
                    (1 - noiseRatio) * 100 * 0.10
                );

            const risk =
                avgRiskScore > 70 || hotspotCount > 25
                    ? 2
                    : avgRiskScore > 40
                        ? 1
                        : 0;

            rows.push({

                totalCommits,

                totalPRs:
                    Math.floor(totalCommits * 0.2),

                avgImpactScore,

                avgRiskScore,

                avgMeaningfulness:
                    this.random(10, 100),

                riskyCommits:
                    this.random(0, 50),

                highImpactCommits:
                    this.random(0, 50),

                lowValueCommits:
                    this.random(0, 50),

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

                label_engineeringHealth:
                    Math.round(
                        Math.max(
                            0,
                            Math.min(
                                100,
                                healthScore,
                            ),
                        ),
                    ),

                label_deliveryRisk:
                    risk,
            });
        }

        return rows;
    }

    private random(
        min: number,
        max: number,
    ) {

        return Math.floor(
            Math.random() *
            (max - min + 1),
        ) + min;
    }
}