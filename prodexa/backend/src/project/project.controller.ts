import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  ) {}

  // -------------------- Project CRUD --------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.createProject(createProjectDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserProjects(@Req() req) {
    return this.projectService.getUserProjects(req.user.userId);
  }

  // -------------------- Developer Analytics --------------------
  @UseGuards(JwtAuthGuard)
  @Post(':id/analyze')
  async analyzeProject(
    @Req() req,
    @Param('id') projectId: string,
    @Query('since') since?: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: req.user.userId } });

    // FIX: use githubToken field instead of passwordHash
    if (!user || !user.githubToken) {
      throw new BadRequestException('GitHub token not found for this user');
    }

    const sinceDate = since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    await this.analyticsQueue.add('analyzeProject', {
      projectId,
      githubToken: user.githubToken, // FIX: pass githubToken, not passwordHash
      since: sinceDate,
    });

    return { message: 'Analysis job added to queue' };
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

  // -------------------- ML/Intelligence Endpoints --------------------
  @UseGuards(JwtAuthGuard)
  @Get(':id/intelligence/project')
  async getProjectPrediction(@Param('id') projectId: string) {
    return this.devService.predictProject(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/intelligence/developer/:login')
  async getDeveloperPrediction(
    @Param('id') projectId: string,
    @Param('login') developerLogin: string,
  ) {
    return this.devService.predictDeveloper(developerLogin, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/leaderboard')
  async getLeaderboard(@Param('id') projectId: string) {
    return this.devService.getProjectLeaderboard(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/health')
  async getProjectHealth(@Param('id') projectId: string) {
    return this.devService.getProjectHealth(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/risk')
  async getDeveloperRisk(
    @Param('id') projectId: string,
    @Query('days') daysThreshold?: string,
  ) {
    const days = daysThreshold ? parseInt(daysThreshold, 10) : 7;
    return this.devService.getDeveloperRisk(projectId, days);
  }
}
