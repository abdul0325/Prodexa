import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    /**
     * Unified project dashboard endpoint
     * Returns: health, leaderboard, developer risk
     */
    @Get('project/:id')
    async getProjectDashboard(
        @Param('id') projectId: string,
        @Query('days') daysThreshold?: string,
    ) {
        const days = daysThreshold ? parseInt(daysThreshold, 10) : 7;
        return this.dashboardService.getProjectDashboard(projectId, days);
    }

    /**
     * Optional: Project activity timeline endpoint
     */
    @Get('project/:id/activity')
    async getActivityTimeline(@Param('id') projectId: string) {
        return this.dashboardService.getActivityTimeline(projectId);
    }

    @Get('project/:id/leaderboard')
    async getLeaderboard(@Param('id') projectId: string) {
        return this.dashboardService.getProjectLeaderboard(projectId);
    }
}