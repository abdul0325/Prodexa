import { Injectable, Logger } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { Process } from '@nestjs/bull';

interface AnalyzeProjectJobData {
  projectId: string;
  token: string;
  since: string;
}

@Processor('analytics')
@Injectable()
export class AnalyticsQueueService {
  private readonly logger = new Logger(AnalyticsQueueService.name);

  constructor(
    private devService: DeveloperAnalyticsService,
    private prisma: PrismaService,
  ) {}

  @Process('analyzeProject')
  async handleAnalyzeProject(job: Job<AnalyzeProjectJobData>) {
    const { projectId, token, since } = job.data;

    this.logger.log(`Starting analysis for project ${projectId}`);

    // 1️⃣ Fetch project info
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    // 2️⃣ Analyze developers & contributors
    await this.devService.analyzeProjectContributors(projectId);

    // 3️⃣ Predict project-level metrics
    const projectPrediction = await this.devService.predictProject(projectId);

    // 4️⃣ Predict developer-level metrics
    const developerActivities = await this.prisma.developerActivity.findMany({ where: { projectId } });
    for (const dev of developerActivities) {
      await this.devService.predictDeveloper(dev.developerLogin, projectId);
    }

    this.logger.log(`Finished analysis for project ${projectId}`);
    return { message: 'Project analyzed successfully', projectPrediction };
  }
}