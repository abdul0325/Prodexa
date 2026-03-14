import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MLService {
    constructor(
        private httpService: HttpService,
        private prisma: PrismaService,
    ) { }

    private mlServiceUrl = 'http://localhost:5000'; // ML-service backend URL

    // Send project data to ML-service for predictions
    async analyzeProject(projectId: string) {
        // Get project & developer data
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { developerActivities: true },
        });

        if (!project) throw new HttpException('Project not found', HttpStatus.NOT_FOUND);

        const payload = {
            projectId: project.id,
            projectName: project.name,
            developers: project.developerActivities.map(d => ({
                developerLogin: d.developerLogin,
                commits: d.commits,
                pullRequestCount: d.pullRequestCount,
                issueCount: d.issueCount,
                productivityScore: d.productivityScore,
                activityTimestamp: d.activityTimestamp,
            })),
        };

        try {
            const response$ = this.httpService.post(`${this.mlServiceUrl}/predict`, payload);
            const response = await lastValueFrom(response$);

            // Save predictions in DB
            const predictions = response.data; // expect array of predictions
            for (const p of predictions.developers) {
                await this.prisma.developerActivity.update({
                    where: {
                        developerLogin_projectId: {
                            developerLogin: p.developerLogin,
                            projectId,
                        },
                    },
                    data: {
                            predictedScore: p.predictedScore,
                    }
                });
            }

            await this.prisma.prediction.create({
                data: {
                    projectId: project.id,
                    productivityScore: predictions.projectScore,
                    deliveryRisk: predictions.deliveryRisk,
                    workloadForecast: predictions.workloadForecast,
                },
            });

            return predictions;
        } catch (error) {
            console.error(error);
            throw new HttpException('ML service request failed', HttpStatus.BAD_GATEWAY);
        }
    }
}
