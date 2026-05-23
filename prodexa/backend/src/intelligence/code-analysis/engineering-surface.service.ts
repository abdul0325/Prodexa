/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class EngineeringSurfaceService {

    classify(
        filename: string,
    ) {

        const lower =
            filename.toLowerCase();

        // ─────────────────────────────
        // SECURITY
        // ─────────────────────────────

        if (
            lower.includes('auth') ||
            lower.includes('jwt') ||
            lower.includes('security')
        ) {

            return {
                surface: 'SECURITY',
                criticality: 'HIGH',
            };
        }

        // ─────────────────────────────
        // DATABASE
        // ─────────────────────────────

        if (
            lower.includes('prisma') ||
            lower.includes('migration') ||
            lower.includes('schema')
        ) {

            return {
                surface: 'DATABASE',
                criticality: 'HIGH',
            };
        }

        // ─────────────────────────────
        // INFRA
        // ─────────────────────────────

        if (
            lower.includes('docker') ||
            lower.includes('nginx') ||
            lower.includes('deploy')
        ) {

            return {
                surface: 'INFRASTRUCTURE',
                criticality: 'HIGH',
            };
        }

        // ─────────────────────────────
        // FRONTEND
        // ─────────────────────────────

        if (
            lower.includes('/app/') ||
            lower.includes('/components/')
        ) {

            return {
                surface: 'FRONTEND',
                criticality: 'MEDIUM',
            };
        }

        // ─────────────────────────────
        // BACKEND
        // ─────────────────────────────

        if (
            lower.includes('/services/') ||
            lower.includes('/controllers/')
        ) {

            return {
                surface: 'BACKEND',
                criticality: 'HIGH',
            };
        }

        // ─────────────────────────────
        // TESTS
        // ─────────────────────────────

        if (
            lower.includes('.spec.') ||
            lower.includes('/test/')
        ) {

            return {
                surface: 'TESTING',
                criticality: 'LOW',
            };
        }

        // ─────────────────────────────
        // ANALYTICS
        // ─────────────────────────────

        if (
            lower.includes('analytics') ||
            lower.includes('metrics')
        ) {

            return {
                surface: 'ANALYTICS',
                criticality: 'HIGH',
            };
        }

        // ─────────────────────────────
        // AI / ML
        // ─────────────────────────────

        if (
            lower.includes('intelligence') ||
            lower.includes('/ml/')
        ) {

            return {
                surface: 'AI_INTELLIGENCE',
                criticality: 'HIGH',
            };
        }

        return {
            surface: 'GENERAL',
            criticality: 'LOW',
        };
    }
}