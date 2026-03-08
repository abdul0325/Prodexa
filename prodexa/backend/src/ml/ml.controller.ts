import { Controller, Post, Param } from '@nestjs/common';
import { MLService } from './ml.service';

@Controller('ml')
export class MLController {
  constructor(private mlService: MLService) {}

  @Post('project/:id/analyze')
  async analyzeProject(@Param('id') projectId: string) {
    return this.mlService.analyzeProject(projectId);
  }
}