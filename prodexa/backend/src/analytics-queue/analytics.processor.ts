import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';

@Processor('analytics')
export class AnalyticsProcessor extends WorkerHost {
  constructor(private devService: DeveloperAnalyticsService) {
    super();
  }

  async process(job: Job<any>) {
    if (job.name === 'analyze-developers') {
      const { projectId, token, since } = job.data;

      return this.devService.analyzeDevelopers(
        projectId,
        token,
        since,
      );
    }
  }
}