/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KPIService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async calculatePRCycleTime(
        normalizedEvent: any,
    ) {

        const pr =
            normalizedEvent.pullRequest;

        if (!pr.mergedAt) {
            return;
        }

        const createdAt =
            new Date(pr.createdAt);

        const mergedAt =
            new Date(pr.mergedAt);

        const cycleTimeHours =
            (
                mergedAt.getTime() -
                createdAt.getTime()
            ) / (1000 * 60 * 60);

        await this.prisma.engineeringKPI.create({

            data: {

                repositoryId:
                    normalizedEvent.repository.id.toString(),

                developerLogin:
                    normalizedEvent.author.login,

                metricName:
                    'PR_CYCLE_TIME_HOURS',

                metricValue:
                    cycleTimeHours,

                metricDate:
                    mergedAt,

                metadata: {
                    prTitle: pr.title,
                    prId: pr.githubPrId,
                },
            },
        });
    }
}