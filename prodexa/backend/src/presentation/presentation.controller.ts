import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/prisma/auth/jwt-auth.guard';
import { DashboardService } from './presentation.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('project/:id')
  async getProjectDashboard(
    @Param('id') projectId: string,
    @Query('days') daysThreshold?: string,
  ) {
    const days = daysThreshold ? parseInt(daysThreshold, 10) : 7;
    return this.dashboardService.getProjectDashboard(projectId, days);
  }

  @Get('project/:id/activity')
  async getActivityTimeline(@Param('id') projectId: string) {
    return this.dashboardService.getActivityTimeline(projectId);
  }

  @Get('project/:id/leaderboard')
  async getLeaderboard(@Param('id') projectId: string) {
    return this.dashboardService.getProjectLeaderboard(projectId);
  }
}
