import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';
import { DeveloperAnalyticsService } from '../developer-analytics/developer-analytics.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('projects')
export class ProjectController {
    constructor(private projectService: ProjectService,
        private devService: DeveloperAnalyticsService,
        @InjectQueue('analytics') private analyticsQueue: Queue,
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
async analyze(@Param('id') id: string) {
  const job = await this.analyticsQueue.add('analyze-project', {
    projectId: id,
  });

  return {
    status: 'queued',
    jobId: job.id,
  };
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
