import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsQueueService } from './analytics-queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analytics',
    }),
  ],
  providers: [AnalyticsQueueService],
  exports: [AnalyticsQueueService, BullModule], 
})
export class AnalyticsQueueModule {}