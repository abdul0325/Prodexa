/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class EngineeringSurfaceService {

    classify(
        filename: string,
    ) {

        const lower =
            filename.toLowerCase();

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

        if (
            lower.includes('/app/') ||
            lower.includes('/components/')
        ) {

            return {
                surface: 'FRONTEND',
                criticality: 'MEDIUM',
            };
        }

        if (
            lower.includes('/services/') ||
            lower.includes('/controllers/')
        ) {

            return {
                surface: 'BACKEND',
                criticality: 'HIGH',
            };
        }


        if (
            lower.includes('.spec.') ||
            lower.includes('/test/')
        ) {

            return {
                surface: 'TESTING',
                criticality: 'LOW',
            };
        }

        if (
            lower.includes('analytics') ||
            lower.includes('metrics')
        ) {

            return {
                surface: 'ANALYTICS',
                criticality: 'HIGH',
            };
        }

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