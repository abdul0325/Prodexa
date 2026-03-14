import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MLDataService } from './ml-data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// FIX: Added JwtAuthGuard to protect all ML data endpoints
@UseGuards(JwtAuthGuard)
@Controller('ml')
export class MLDataController {
  constructor(private mlDataService: MLDataService) {}

  // Project-level training data
  @Get('project/:id')
  async getProjectData(@Param('id') projectId: string) {
    return this.mlDataService.getProjectData(projectId);
  }

  // Developer-level training data
  @Get('project/:id/developers')
  async getDeveloperData(@Param('id') projectId: string) {
    return this.mlDataService.getDeveloperData(projectId);
  }
}
