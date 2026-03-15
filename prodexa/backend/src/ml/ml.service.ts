import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MLService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  private mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';

  async analyzeProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { developerActivities: true },
    });

    if (!project) throw new HttpException('Project not found', HttpStatus.NOT_FOUND);

    // Build payload from real DB data
    const payload = {
      projectId: project.id,
      projectName: project.name,
      developers: project.developerActivities.map((d) => ({
        developerLogin: d.developerLogin,
        commits: d.commits,
        pullRequestCount: d.pullRequestCount,
        issueCount: d.issueCount,
        productivityScore: d.productivityScore,
      })),
    };

    try {
      // Call FastAPI ML service
      const response$ = this.httpService.post(`${this.mlServiceUrl}/predict`, payload);
      const response = await lastValueFrom(response$);
      const predictions = response.data;

      // Save per-developer predicted scores back to DB
      for (const dev of predictions.developers) {
        await this.prisma.developerActivity.update({
          where: {
            developerLogin_projectId: {
              developerLogin: dev.developerLogin,
              projectId,
            },
          },
          data: { predictedScore: Math.round(dev.predictedScore) },
        });
      }

      // Save project-level prediction to DB
      await this.prisma.prediction.create({
        data: {
          projectId,
          productivityScore: predictions.projectScore,
          deliveryRisk: predictions.deliveryRisk,
          workloadForecast: predictions.workloadForecast,
        },
      });

      return predictions;

    } catch (error) {
      throw new HttpException(
        'ML service request failed — make sure FastAPI is running on port 5000',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // Health check — verify ML service is reachable
  async checkHealth() {
    try {
      const response$ = this.httpService.get(`${this.mlServiceUrl}/health`);
      const response = await lastValueFrom(response$);
      return response.data;
    } catch {
      return { status: 'unreachable', url: this.mlServiceUrl };
    }
  }
}