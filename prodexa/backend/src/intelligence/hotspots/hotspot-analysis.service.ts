/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

@Injectable()
export class HotspotAnalysisService {

    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async analyzeHotspots() {

        const fileChanges =
            await this.prisma
                .commitFileChange
                .groupBy({

                    by: ['filename'],

                    _count: {
                        filename: true,
                    },

                    _sum: {
                        additions: true,
                        deletions: true,
                        changes: true,
                    },

                    orderBy: {
                        _count: {
                            filename: 'desc',
                        },
                    },

                    take: 15,
                });

        const hotspots =
            fileChanges.map(file => {

                const frequency =
                    file._count.filename;

                const totalChanges =
                    file._sum.changes || 0;

                let instabilityScore = 0;

                const reasons: string[] = [];

                if (frequency >= 10) {

                    instabilityScore += 40;

                    reasons.push(
                        'Very high modification frequency',
                    );

                } else if (frequency >= 5) {

                    instabilityScore += 20;

                    reasons.push(
                        'Frequently modified file',
                    );
                }

                if (totalChanges >= 1000) {

                    instabilityScore += 40;

                    reasons.push(
                        'Large cumulative code churn',
                    );

                } else if (totalChanges >= 300) {

                    instabilityScore += 20;

                    reasons.push(
                        'Moderate cumulative churn',
                    );
                }

                if (
                    file.filename.includes('auth') ||
                    file.filename.includes('security') ||
                    file.filename.includes('payment')
                ) {

                    instabilityScore += 30;

                    reasons.push(
                        'Critical system surface',
                    );
                }

                const severity =
                    this.getSeverity(
                        instabilityScore,
                    );

                return {

                    filename:
                        file.filename,

                    modificationCount:
                        frequency,

                    totalChanges,

                    instabilityScore:
                        Math.min(
                            100,
                            instabilityScore,
                        ),

                    severity,

                    reasons,
                };
            });

        hotspots.sort(
            (a, b) =>
                b.instabilityScore -
                a.instabilityScore,
        );

        return {

            totalHotspots:
                hotspots.length,

            hotspots,
        };
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