import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('project/:id')
    async getProjectDashboard(@Param('id') projectId: string) {
        return this.dashboardService.getProjectDashboard(projectId);
    }

    @Get('project/:id/developers')
    async getDeveloperLeaderboard(@Param('id') projectId: string) {
        return this.dashboardService.getDeveloperLeaderboard(projectId);
    }

    @Get('project/:id/activity')
    async getActivityTimeline(@Param('id') projectId: string) {
        return this.dashboardService.getActivityTimeline(projectId);
    }

    @Get('project/:id/leaderboard')
    getLeaderboard(@Param('id') projectId: string) {
        return this.dashboardService.getLeaderboard(projectId);
    }
}