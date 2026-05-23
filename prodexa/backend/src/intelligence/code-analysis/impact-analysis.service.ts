/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

import { NoiseDetectionService }
    from './noise-detection.service';

import { EngineeringSurfaceService }
    from './engineering-surface.service';

@Injectable()
export class ImpactAnalysisService {

    constructor(
        private readonly prisma:
            PrismaService,

        private readonly noiseDetection:
            NoiseDetectionService,

        private readonly surfaceAnalysis:
            EngineeringSurfaceService,
    ) { }

    async analyzeCommit(
        commitSha: string,
    ) {

        console.log(
            'ANALYZING COMMIT IMPACT:',
            commitSha,
        );

        const files =
            await this.prisma
                .commitFileChange
                .findMany({

                    where: {
                        commitSha,
                    },
                });

        console.log(
            'FILES FOUND:',
            files.length,
        );

        if (!files.length) {
            return null;
        }

        let impactScore = 0;
        let riskScore = 0;
        let meaningfulnessScore = 0;

        const reasons: string[] = [];

        for (const file of files) {

            // ─────────────────────────────
            // NOISE DETECTION
            // ─────────────────────────────

            const noise =
                this.noiseDetection
                    .analyzePatch(
                        file.filename,
                        file.patch || '',
                    );

            if (noise.isNoise) {

                impactScore -= 20;

                meaningfulnessScore -= 20;

                reasons.push(
                    ...noise.reasons,
                );

                continue;
            }

            // ─────────────────────────────
            // ENGINEERING SURFACE
            // ─────────────────────────────

            const surface =
                this.surfaceAnalysis
                    .classify(
                        file.filename,
                    );

            reasons.push(
                `Engineering surface affected: ${surface.surface}`,
            );

            if (
                surface.criticality === 'HIGH'
            ) {

                riskScore += 15;

                impactScore += 20;
            }

            // ─────────────────────────────
            // DOCUMENTATION
            // ─────────────────────────────

            if (file.isDocumentation) {

                impactScore += 2;

                meaningfulnessScore += 5;

                reasons.push(
                    `Documentation updated: ${file.filename}`,
                );

                continue;
            }

            // ─────────────────────────────
            // TEST FILES
            // ─────────────────────────────

            if (file.isTestFile) {

                impactScore += 20;

                meaningfulnessScore += 30;

                reasons.push(
                    `Test coverage updated: ${file.filename}`,
                );
            }

            // ─────────────────────────────
            // CONFIG FILES
            // ─────────────────────────────

            if (file.isConfigFile) {

                impactScore += 10;

                riskScore += 20;

                reasons.push(
                    `Infrastructure/config modified: ${file.filename}`,
                );
            }

            // ─────────────────────────────
            // LARGE CODE CHANGES
            // ─────────────────────────────

            const totalChanges =
                file.additions +
                file.deletions;

            if (totalChanges > 200) {

                impactScore += 35;

                riskScore += 30;

                reasons.push(
                    `Large code modification in ${file.filename}`,
                );

            } else if (totalChanges > 50) {

                impactScore += 20;

                riskScore += 10;
            }

            // ─────────────────────────────
            // BACKEND BUSINESS LOGIC
            // ─────────────────────────────

            if (
                file.filename.includes('/services/') ||
                file.filename.includes('/controllers/')
            ) {

                impactScore += 30;

                meaningfulnessScore += 25;

                reasons.push(
                    `Core backend logic changed: ${file.filename}`,
                );
            }

            // ─────────────────────────────
            // SECURITY / AUTH
            // ─────────────────────────────

            if (
                file.filename.includes('auth') ||
                file.filename.includes('security') ||
                file.filename.includes('jwt')
            ) {

                riskScore += 40;

                impactScore += 35;

                reasons.push(
                    `Security-sensitive file modified: ${file.filename}`,
                );
            }
        }

        // ─────────────────────────────
        // SCORE NORMALIZATION
        // ─────────────────────────────

        impactScore =
            Math.max(0, impactScore);

        riskScore =
            Math.max(0, riskScore);

        meaningfulnessScore =
            Math.max(0, meaningfulnessScore);

        impactScore =
            Math.min(100, impactScore);

        riskScore =
            Math.min(100, riskScore);

        meaningfulnessScore =
            Math.min(100, meaningfulnessScore);

        // ─────────────────────────────
        // REMOVE DUPLICATE REASONS
        // ─────────────────────────────

        const uniqueReasons =
            [...new Set(reasons)];

        // ─────────────────────────────
        // LEVELS
        // ─────────────────────────────

        const impactLevel =
            this.getImpactLevel(
                impactScore,
            );

        const riskLevel =
            this.getRiskLevel(
                riskScore,
            );

        // ─────────────────────────────
        // SUMMARY
        // ─────────────────────────────

        const summary =
            this.generateSummary(
                impactLevel,
                riskLevel,
            );

        console.log(
            'SAVING IMPACT ANALYSIS',
            {
                impactScore,
                riskScore,
                meaningfulnessScore,
            },
        );

        return this.prisma
            .commitImpactAnalysis
            .upsert({

                where: {
                    commitSha,
                },

                update: {

                    impactScore,
                    riskScore,
                    meaningfulnessScore,
                    impactLevel,
                    riskLevel,
                    summary,

                    reasons:
                        uniqueReasons,
                },

                create: {

                    commitSha,

                    impactScore,
                    riskScore,
                    meaningfulnessScore,

                    impactLevel,
                    riskLevel,

                    summary,

                    reasons:
                        uniqueReasons,
                },
            });
    }

    private getImpactLevel(
        score: number,
    ) {

        if (score >= 80) {
            return 'VERY_HIGH';
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

        return 'MINIMAL';
    }

    private getRiskLevel(
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

        return 'MINIMAL';
    }

    private generateSummary(
        impact: string,
        risk: string,
    ) {

        return `
            Commit impact classified as ${impact}
            with ${risk} engineering risk.
        `;
    }
}