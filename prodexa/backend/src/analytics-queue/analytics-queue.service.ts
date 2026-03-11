import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { PrismaService } from '../prisma/prisma.service';

interface AnalyzeProjectJobData {
  projectId: string;
  token: string;
  since: string;
}

@Processor('analytics')
@Injectable()
export class AnalyticsQueueService extends WorkerHost {

  private readonly logger = new Logger(AnalyticsQueueService.name);

  constructor(
    private devService: DeveloperAnalyticsService,
    private prisma: PrismaService,
    @InjectQueue('analytics') private analyticsQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<AnalyzeProjectJobData>) {

    if (job.name === 'analyzeProject') {

      const { projectId } = job.data;

      this.logger.log(`Starting analysis for project ${projectId}`);

      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error(`Project ${projectId} not found`);
      }

      // Analyze contributors
      await this.devService.analyzeProjectContributors(projectId);

      // Predict project metrics
      const projectPrediction =
        await this.devService.predictProject(projectId);

      // Predict developer metrics
      const developerActivities =
        await this.prisma.developerActivity.findMany({
          where: { projectId },
        });

      for (const dev of developerActivities) {
        await this.devService.predictDeveloper(
          dev.developerLogin,
          projectId,
        );
      }

      this.logger.log(`Finished analysis for project ${projectId}`);

      return {
        message: 'Project analyzed successfully',
        projectPrediction,
      };
    }
  }

  async addProjectAnalysisJob(projectId: string) {

    await this.analyticsQueue.add('analyzeProject', {
      projectId,
      since: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    return { message: 'Analysis job added to queue' };
  }
}