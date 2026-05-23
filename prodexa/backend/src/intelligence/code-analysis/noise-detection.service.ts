import { Injectable } from '@nestjs/common';

@Injectable()
export class NoiseDetectionService {

    analyzePatch(
        filename: string,
        patch?: string,
    ) {

        const reasons: string[] = [];

        let noiseScore = 0;

        // ─────────────────────────────
        // DOCS FILES
        // ─────────────────────────────

        if (
            filename.endsWith('.md') ||
            filename.includes('README')
        ) {

            noiseScore += 60;

            reasons.push(
                'Documentation-only change',
            );
        }

        // ─────────────────────────────
        // LOCKFILES
        // ─────────────────────────────

        if (
            filename.includes('package-lock') ||
            filename.includes('yarn.lock') ||
            filename.includes('pnpm-lock')
        ) {

            noiseScore += 80;

            reasons.push(
                'Dependency lockfile update',
            );
        }

        // ─────────────────────────────
        // GENERATED FILES
        // ─────────────────────────────

        if (
            filename.includes('/dist/') ||
            filename.includes('/build/') ||
            filename.includes('.next/')
        ) {

            noiseScore += 90;

            reasons.push(
                'Generated/build artifact',
            );
        }

        // ─────────────────────────────
        // PATCH ANALYSIS
        // ─────────────────────────────

        if (patch) {

            const lines =
                patch.split('\n');

            const codeLines =
                lines.filter(line => {

                    const trimmed =
                        line.trim();

                    if (
                        trimmed.startsWith('//') ||
                        trimmed.startsWith('*') ||
                        trimmed.startsWith('#')
                    ) {
                        return false;
                    }

                    return (
                        trimmed.startsWith('+') ||
                        trimmed.startsWith('-')
                    );
                });

            // Mostly comments/empty changes

            if (codeLines.length < 3) {

                noiseScore += 50;

                reasons.push(
                    'Very small code change',
                );
            }
        }

        return {

            noiseScore:
                Math.min(100, noiseScore),

            isNoise:
                noiseScore >= 70,

            reasons,
        };
    }
}