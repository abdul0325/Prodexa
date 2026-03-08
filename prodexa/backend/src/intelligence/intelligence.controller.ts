import { Controller, Get, Param } from '@nestjs/common';
import { IntelligenceService } from './intelligence.service';

@Controller('intelligence')
export class IntelligenceController {
  constructor(private intelligenceService: IntelligenceService) { }

  @Get('project/:projectId')
  async predictProject(@Param('projectId') projectId: string) {
    return this.intelligenceService.predictProject(projectId);
  }

  @Get('developer/:projectId/:login')
  async predictDeveloper(
    @Param('projectId') projectId: string,
    @Param('login') login: string,
  ) {
    return this.intelligenceService.predictDeveloper(login, projectId);
  }

  @Get("project/:id/health")
  getProjectHealth(@Param("id") projectId: string) {
    return this.intelligenceService.getProjectIntelligence(projectId);
  }
}

@Controller('ml')
export class MLDataController {
  constructor(private intelligenceService: IntelligenceService) {}

  // GET /ml/project/:id/training-data
  @Get('project/:id/training-data')
  async getProjectTrainingData(@Param('id') projectId: string) {
    return this.intelligenceService.getProjectTrainingData(projectId);
  }
}