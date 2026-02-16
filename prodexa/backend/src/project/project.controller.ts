import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
    constructor(private projectService: ProjectService) { }

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

    @UseGuards(JwtAuthGuard)
    @Post(':id/analyze')
    async analyzeProject(@Req() req, @Body() body, @Param('id') id: string) {
        return this.projectService.analyzeProject(req.user.userId, id);
    }

}
