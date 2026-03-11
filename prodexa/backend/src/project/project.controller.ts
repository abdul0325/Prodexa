import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyticsQueueService } from 'src/analytics-queue/analytics-queue.service';

@Controller('projects')
export class ProjectController {
    constructor(
        private projectService: ProjectService,
        private devService: DeveloperAnalyticsService,
        private queueService: AnalyticsQueueService,
        private prisma: PrismaService,
        @InjectQueue('analytics') private analyticsQueue: Queue,
    ) { }

    // -------------------- Project CRUD --------------------
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
        return this.projectService.createProject(createProjectDto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserProjects(@Req() req) {
        return this.projectService.getUserProjects(req.user.id);
    }

    // -------------------- Developer Analytics --------------------
    @UseGuards(JwtAuthGuard)
    @Post(':id/analyze')
    async analyzeProject(@Req() req, @Param('id') projectId: string, @Query('since') since?: string) {
        const user = await this.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user || !user.githubToken) throw new BadRequestException('GitHub token not found for this user');

        const sinceDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        // Add job to analytics queue for async processing
        await this.analyticsQueue.add('analyzeProject', { projectId, token: user.githubToken, since: sinceDate });

        return { message: 'Analysis job added to queue' };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/analytics')
    async getAnalytics(@Req() req, @Param('id') id: string) {
        return this.projectService.getProjectAnalytics(req.user.id, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/summary')
    async getSummary(@Req() req, @Param('id') id: string) {
        return this.projectService.getProjectSummary(req.user.id, id);
    }

    // -------------------- ML/Intelligence Endpoints --------------------
    @UseGuards(JwtAuthGuard)
    @Get(':id/intelligence/project')
    async getProjectPrediction(@Param('id') projectId: string) {
        return this.devService.predictProject(projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/intelligence/developer/:login')
    async getDeveloperPrediction(@Param('id') projectId: string, @Param('login') developerLogin: string) {
        return this.devService.predictDeveloper(developerLogin, projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/leaderboard')
    async getLeaderboard(@Param('id') projectId: string) {
        return this.devService.getProjectLeaderboard(projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/health')
    async getProjectHealth(
        @Req() req,
        @Param('id') projectId: string,
    ) {
        return this.devService.getProjectHealth(projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/risk')
    async getDeveloperRisk(
        @Param('id') projectId: string,
        @Query('days') daysThreshold?: string,
    ) {
        const days = daysThreshold ? parseInt(daysThreshold, 10) : 7; // default 7 days
        return this.devService.getDeveloperRisk(projectId, days);
    }
}