/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsQueueService } from './analytics.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeveloperAnalyticsModule } from 'src/developer-analytics/developer-analytics.module';
import { AnalyticsProcessor } from './processors/analytics.processor';
import { IntelligenceModule } from 'src/intelligence/intelligence.module';
import { NotificationsModule } from 'src/prisma/notifications/notifications.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { MetricsAggregationService } from 'src/analytics/services/metrics-aggregation.service';
import { CommitService } from 'src/analytics/services/commit.service';
import { PullRequestService } from 'src/analytics/services/pull-request.service';
import { KPIService } from 'src/analytics/services/kpi.service';
import { AnalyticsController } from 'src/analytics/controllers/analytics.controller';
import { AnalyticsReadService } from 'src/analytics/services/analytics-read.service';
import { EngineeringHealthService } from 'src/analytics/services/engineering-health.service';
import { RiskDetectionService } from 'src/analytics/services/risk-detection.service';
import { TrendsService } from 'src/analytics/services/trends.service';
import { DeltaAnalyticsService } from 'src/analytics/services/delta-analytics.service';
import { CommitFileChangeService } from './services/commit-file-change.service';
import { HealthCalculationService } from './services/health-calculation.service';
import { MLModule } from 'src/ml/ml.module';
import { BootstrapProcessor } from './processors/bootstrap.processor';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'analytics',
      },
      {
        name: 'bootstrap',
      },
    ),
    PrismaModule,
    DeveloperAnalyticsModule,
    IntelligenceModule,
    NotificationsModule,
    GatewayModule,
    IntelligenceModule,
    MLModule,
    GithubModule
  ],
  controllers: [
    AnalyticsController,
  ],

  providers: [AnalyticsQueueService, AnalyticsProcessor, BootstrapProcessor, MetricsAggregationService, CommitService, PullRequestService, KPIService, AnalyticsReadService, EngineeringHealthService, RiskDetectionService, TrendsService, DeltaAnalyticsService, CommitFileChangeService, HealthCalculationService],
  exports: [AnalyticsQueueService, MetricsAggregationService, BullModule, CommitService, PullRequestService, KPIService, EngineeringHealthService, RiskDetectionService, CommitFileChangeService],
})
export class AnalyticsQueueModule { }
