import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { IntelligenceService } from 'src/intelligence/intelligence.service';
import { Process } from '@nestjs/bull';

@Processor('analytics')
export class AnalyticsProcessor extends WorkerHost {
  constructor(private devService: DeveloperAnalyticsService,
    private intelligenceService: IntelligenceService,
  ) {
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

  @Process('analyze-project')
  async handleProjectAnalysis(job: any) {

    const { projectId } = job.data;

    await this.devService.analyzeProjectContributors(projectId);

    await this.intelligenceService.getProjectIntelligence(projectId);

  }
}