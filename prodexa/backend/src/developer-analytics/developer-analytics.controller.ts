import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { DeveloperAnalyticsService } from './developer-analytics.service';

@Controller('developer-analytics')
export class DeveloperAnalyticsController {
    constructor(private devService: DeveloperAnalyticsService) { }

    @Post(':projectId/analyze')
    async analyzeDevelopers(
        @Param('projectId') projectId: string,
        @Body('userId') userId: string,
        @Body('since') since?: string,
    ) {
        const sinceDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // default last 30 days
        return this.devService.analyzeDevelopers(userId, projectId, sinceDate);
    }

    @Get(':projectId')
    async getProjectDevelopers(
        @Param('projectId') projectId: string,
        @Query('login') developerLogin?: string,
    ) {
        return this.devService.getDeveloperAnalytics(projectId, developerLogin);
    }
}
