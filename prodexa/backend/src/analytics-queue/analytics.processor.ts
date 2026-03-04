import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { IntelligenceService } from '../intelligence/intelligence.service';

@Processor('analytics')
export class AnalyticsProcessor extends WorkerHost {
  constructor(
    private analyticsService: DeveloperAnalyticsService,
    private intelligenceService: IntelligenceService,
  ) {
    super();
  }

  async process(job: Job<{ projectId: string }>) {
    const { projectId } = job.data;

    await this.analyticsService.analyzeProject(projectId);
    await this.intelligenceService.predictProject(projectId);

    return { completed: true };
  }
}       