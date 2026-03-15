import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { MLService } from './ml.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ml')
export class MLController {
  constructor(private mlService: MLService) {}

  // Trigger full ML analysis for a project
  @UseGuards(JwtAuthGuard)
  @Post('project/:id/analyze')
  async analyzeProject(@Param('id') projectId: string) {
    return this.mlService.analyzeProject(projectId);
  }

  // Check if ML service is reachable
  @Get('health')
  async checkHealth() {
    return this.mlService.checkHealth();
  }
}