/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { EngineeringHealthService } from './engineering-health.service';
import { RiskDetectionService } from './risk-detection.service';
import { AIInsightsService } from 'src/intelligence/services/ai-insights.service';
import { TrendsService } from './trends.service';
import { DeltaAnalyticsService } from './delta-analytics.service';
import { ForecastingService } from 'src/intelligence/services/forecasting.service';
import { ExecutiveSummaryService } from 'src/intelligence/services/executive-summary.service';
import { HotspotAnalysisService } from 'src/intelligence/hotspots/hotspot-analysis.service';
import { RiskPropagationService } from 'src/intelligence/risk/risk-propagation.service';
import { EngineeringHealthV2Service } from 'src/intelligence/health/engineering-health-v2.service';
import { DeliveryForecastingService } from 'src/intelligence/forecasting/delivery-forecasting.service';

@Injectable()
export class AnalyticsReadService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly healthEngine: EngineeringHealthService,
        private readonly riskEngine: RiskDetectionService,
        private readonly aiInsights: AIInsightsService,
        private readonly trendsService: TrendsService,
        private readonly deltaAnalytics: DeltaAnalyticsService,
        private readonly forecasting: ForecastingService,
        private readonly executiveSummary: ExecutiveSummaryService,
        private readonly hotspotAnalysis: HotspotAnalysisService,
        private readonly riskPropagation: RiskPropagationService,
        private readonly engineeringHealthV2: EngineeringHealthV2Service,
        private readonly deliveryForecasting: DeliveryForecastingService,
    ) { }

    async getOverview() {

        const [
            totalCommits,
            totalPRs,
            averagePRCycleTime,
        ] = await Promise.all([

            this.prisma.commitEvent.count(),

            this.prisma.pullRequestEvent.count(),

            this.prisma.engineeringKPI.aggregate({

                where: {
                    metricName:
                        'PR_CYCLE_TIME_HOURS',
                },

                _avg: {
                    metricValue: true,
                },
            }),
        ]);

        return {

            totalCommits,

            totalPRs,

            averagePRCycleTime:
                averagePRCycleTime._avg.metricValue || 0,
        };
    }

    async getPRInsights() {

        const [
            totalPRs,

            mergedPRs,

            openPRs,

            averageCycleTime,

            recentPRs,
        ] = await Promise.all([

            this.prisma.pullRequestEvent.count(),

            this.prisma.pullRequestEvent.count({
                where: {
                    state: 'closed',
                },
            }),

            this.prisma.pullRequestEvent.count({
                where: {
                    state: 'open',
                },
            }),

            this.prisma.engineeringKPI.aggregate({

                where: {
                    metricName:
                        'PR_CYCLE_TIME_HOURS',
                },

                _avg: {
                    metricValue: true,
                },
            }),

            this.prisma.pullRequestEvent.findMany({

                take: 5,

                orderBy: {
                    createdAtGithub: 'desc',
                },

                select: {
                    title: true,
                    authorLogin: true,
                    state: true,
                    additions: true,
                    deletions: true,
                    createdAtGithub: true,
                },
            }),
        ]);

        return {

            totalPRs,

            mergedPRs,

            openPRs,

            averagePRCycleTime:
                averageCycleTime._avg.metricValue || 0,

            recentPRs,
        };
    }

    async getCommitActivity() {

        const commits =
            await this.prisma.commitEvent.groupBy({

                by: ['branch'],

                _count: {
                    id: true,
                },

                orderBy: {
                    _count: {
                        id: 'desc',
                    },
                },
            });

        const recentCommits =
            await this.prisma.commitEvent.findMany({

                take: 10,

                orderBy: {
                    committedAt: 'desc',
                },

                select: {

                    sha: true,

                    message: true,

                    authorLogin: true,

                    branch: true,

                    committedAt: true,
                },
            });

        return {

            branchActivity: commits,

            recentCommits,
        };
    }

    async getKPIs() {

        const kpis =
            await this.prisma.engineeringKPI.findMany({

                orderBy: {
                    metricDate: 'desc',
                },

                take: 20,
            });

        return {

            totalKPIs:
                kpis.length,

            metrics: kpis,
        };
    }

    async getEngineeringHealth(
        projectId: string,
    ) {

        return this.healthEngine
            .calculateHealthScore(projectId);
    }

    async getRiskDetection(
        projectId: string,
    ) {

        return this.riskEngine
            .detectRisks(projectId);
    }

    async getAIInsights(
        projectId: string,
    ) {

        return this.aiInsights
            .generateInsights(projectId);
    }

    async getTrends(
        projectId: string,
    ) {

        return this.trendsService
            .getProjectTrends(
                projectId,
            );
    }

    async getProjectDeltas(
        projectId: string,
    ) {

        return this.deltaAnalytics
            .getProjectDeltas(
                projectId,
            );
    }

    async getForecast(
        projectId: string,
    ) {

        return this.forecasting
            .generateForecast(
                projectId,
            );
    }

    async getExecutiveSummary(
        projectId: string,
    ) {

        return this.executiveSummary
            .generateSummary(
                projectId,
            );
    }

    async getHotspots() {

        return this.hotspotAnalysis
            .analyzeHotspots();
    }

    async getRiskPropagation() {

        return this.riskPropagation
            .analyzeRiskPropagation();
    }

    async getEngineeringHealthV2() {

        return this.engineeringHealthV2
            .calculateHealth();
    }

    async getDeliveryForecast() {

        return this.deliveryForecasting
            .generateForecast();
    }
}
