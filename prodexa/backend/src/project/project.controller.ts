import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';

@Controller('projects')
export class ProjectController {
    constructor(private projectService: ProjectService,
        private devService: DeveloperAnalyticsService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Req() req, @Body() body: any) {
        return this.projectService.createProject(req.user.userId, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserProjects(@Req() req) {
        return this.projectService.getUserProjects(req.user.userId);
    }

    @Post(':id/analyze')
    async analyzeProject(
        @Req() req,
        @Param('id') projectId: string,
        @Query('since') since?: string,
    ) {
        const sinceDate =
            since ||
            new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString();

        return this.devService.analyzeDevelopers(
            projectId,
            req.user.passwordHash,
            sinceDate,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/analytics')
    async getAnalytics(@Req() req, @Param('id') id: string) {
        return this.projectService.getProjectAnalytics(req.user.userId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/summary')
    async getSummary(@Req() req, @Param('id') id: string) {
        return this.projectService.getProjectSummary(req.user.userId, id);
    }




}
