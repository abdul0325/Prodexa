/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { IntelligenceService } from './intelligence.service';
import { IntelligenceController, MLDataController } from './intelligence.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AIInsightsService } from 'src/intelligence/services/ai-insights.service';
import { ForecastingService } from './services/forecasting.service';
import { ExecutiveSummaryService } from './services/executive-summary.service';
import { FileClassificationService } from './code-analysis/file-classification.service';
import { ImpactAnalysisService } from './code-analysis/impact-analysis.service';
import { NoiseDetectionService } from './code-analysis/noise-detection.service';
import { EngineeringSurfaceService } from './code-analysis/engineering-surface.service';
import { HotspotAnalysisService } from './hotspots/hotspot-analysis.service';
import { RiskPropagationService } from './risk/risk-propagation.service';
import { EngineeringHealthV2Service } from './health/engineering-health-v2.service';
import { DeliveryForecastingService } from './forecasting/delivery-forecasting.service';

@Module({
  imports: [PrismaModule],
  providers: [
    IntelligenceService,
    AIInsightsService,
    ForecastingService,
    ExecutiveSummaryService,
    FileClassificationService,
    ImpactAnalysisService,
    NoiseDetectionService,
    EngineeringSurfaceService,
    HotspotAnalysisService,
    RiskPropagationService,
    EngineeringHealthV2Service,
    DeliveryForecastingService
  ],
  controllers: [IntelligenceController, MLDataController],
  exports: [
    IntelligenceService,
    AIInsightsService,
    ForecastingService,
    ExecutiveSummaryService,
    FileClassificationService,
    ImpactAnalysisService,
    NoiseDetectionService,
    EngineeringSurfaceService,
    HotspotAnalysisService,
    RiskPropagationService,
    EngineeringHealthV2Service,
    DeliveryForecastingService
  ],
})
export class IntelligenceModule { }
