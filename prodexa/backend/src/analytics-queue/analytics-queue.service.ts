import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AnalyticsQueueService {
  constructor(
    @InjectQueue('analytics') private analyticsQueue: Queue,
  ) {}

  async addDeveloperAnalysisJob(projectId: string, token: string, since: string) {
    await this.analyticsQueue.add('analyze-developers', {
      projectId,
      token,
      since,
    });
  }
}