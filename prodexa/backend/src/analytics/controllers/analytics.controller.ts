/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';

import { AnalyticsReadService }
    from '../services/analytics-read.service';

@Controller('analytics')
export class AnalyticsController {

    constructor(
        private readonly analyticsRead:
            AnalyticsReadService,
    ) { }

    @Get('overview')
    async getOverview() {

        return this.analyticsRead
            .getOverview();
    }

    @Get('pr-insights')
    async getPRInsights() {

        return this.analyticsRead
            .getPRInsights();
    }

    @Get('commit-activity')
    async getCommitActivity() {

        return this.analyticsRead
            .getCommitActivity();
    }

    @Get('kpis')
    async getKPIs() {

        return this.analyticsRead
            .getKPIs();
    }

    @Get(':projectId/engineering-health')
    async getEngineeringHealth(
        @Param('projectId')
        projectId: string,
    ) {

        return this.analyticsRead
            .getEngineeringHealth(projectId);
    }

    @Get(':projectId/risk-detection')
    async getRiskDetection(@Param('projectId') projectId: string) {

        return this.analyticsRead
            .getRiskDetection(projectId);
    }

    @Get(':projectId/ai-insights')
    async getAIInsights(
        @Param('projectId')
        projectId: string,
    ) {

        return this.analyticsRead
            .getAIInsights(projectId);
    }

    @Get(':projectId/trends')
    async getTrends(
        @Param('projectId')
        projectId: string,
    ) {

        return this.analyticsRead
            .getTrends(projectId);
    }

    @Get(':projectId/deltas')
    async getProjectDeltas(
        @Param('projectId')
        projectId: string,
    ) {

        return this.analyticsRead
            .getProjectDeltas(
                projectId,
            );
    }

    @Get(':projectId/forecast')
    async getForecast(
        @Param('projectId')
        projectId: string,
    ) {

        return this.analyticsRead
            .getForecast(
                projectId,
            );
    }

    @Get(':projectId/executive-summary')
    async getExecutiveSummary(
        @Param('projectId')
        projectId: string,
    ) {

        return this.analyticsRead
            .getExecutiveSummary(
                projectId,
            );
    }

    @Get('hotspots')
    async getHotspots() {

        return this.analyticsRead
            .getHotspots();
    }

    @Get('risk-propagation')
    async getRiskPropagation() {

        return this.analyticsRead
            .getRiskPropagation();
    }

    @Get('engineering-health-v2')
    async getEngineeringHealthV2() {

        return this.analyticsRead
            .getEngineeringHealthV2();
    }

    @Get('delivery-forecast')
    async getDeliveryForecast() {

        return this.analyticsRead
            .getDeliveryForecast();
    }
}