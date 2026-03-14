import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { PrismaService } from '../prisma/prisma.service';

// FIX: Removed @Processor('analytics') decorator — only ONE processor per queue.
// The actual job processing is now solely in analytics.processor.ts
@Injectable()
export class AnalyticsQueueService {
  private readonly logger = new Logger(AnalyticsQueueService.name);

  constructor(
    private devService: DeveloperAnalyticsService,
    private prisma: PrismaService,
    @InjectQueue('analytics') private analyticsQueue: Queue,
  ) {}

  async addProjectAnalysisJob(projectId: string) {
    // FIX: fetch the user's githubToken and pass it to the job
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project) throw new Error(`Project ${projectId} not found`);

    const githubToken = project.user?.githubToken;
    if (!githubToken) {
      this.logger.warn(`No GitHub token found for project ${projectId}, skipping analysis`);
      return { message: 'No GitHub token available, analysis skipped' };
    }

    await this.analyticsQueue.add('analyzeProject', {
      projectId,
      githubToken,
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    this.logger.log(`Analysis job queued for project ${projectId}`);
    return { message: 'Analysis job added to queue' };
  }
}
