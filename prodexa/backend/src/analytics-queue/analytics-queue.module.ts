import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsQueueService } from './analytics-queue.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeveloperAnalyticsModule } from 'src/developer-analytics/developer-analytics.module';
import { AnalyticsProcessor } from './analytics.processor';
import { IntelligenceModule } from 'src/intelligence/intelligence.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analytics',
    }),
    PrismaModule, DeveloperAnalyticsModule,IntelligenceModule, NotificationsModule,GatewayModule
  ],
  providers: [AnalyticsQueueService, AnalyticsProcessor],
  exports: [AnalyticsQueueService, BullModule],
})
export class AnalyticsQueueModule { }