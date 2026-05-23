/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { MLService } from './ml.service';

import { JwtAuthGuard }
  from 'src/prisma/auth/jwt-auth.guard';
import { TrainingDataService } from './training-data.service';

@Controller('ml')
export class MLController {

  constructor(
    private readonly mlService: MLService,
    private readonly trainingData: TrainingDataService,
  ) { }

  // Trigger ML analysis
  @UseGuards(JwtAuthGuard)
  @Post('project/:id/analyze')
  async analyzeProject(
    @Param('id')
    projectId: string,
  ) {

    return this.mlService
      .analyzeProject(projectId);
  }

  // ML health check
  @Get('health')
  async checkHealth() {

    return this.mlService
      .checkHealth();
  }

  @Get('dataset')
  async getDataset() {

    return this.trainingData
      .generateDataset();
  }
}