import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsQueueService } from './analytics-queue.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeveloperAnalyticsModule } from 'src/developer-analytics/developer-analytics.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analytics',
    }),
    PrismaModule, DeveloperAnalyticsModule,
  ],
  providers: [AnalyticsQueueService],
  exports: [AnalyticsQueueService, BullModule],
})
export class AnalyticsQueueModule { }