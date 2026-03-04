import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsProcessor } from './analytics.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analytics',
    }),
  ],
  providers: [AnalyticsProcessor],
  exports: [BullModule],
})
export class AnalyticsQueueModule {}