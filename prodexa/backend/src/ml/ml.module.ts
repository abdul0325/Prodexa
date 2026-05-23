/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MLService } from './ml.service';
import { MLController } from './ml.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

import { FeatureEngineeringService }
  from './feature-engineering.service';
import { TrainingDataService } from './training-data.service';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
  ],

  providers: [
    MLService,
    FeatureEngineeringService,
    TrainingDataService
  ],

  controllers: [
    MLController,
  ],

  exports: [
    FeatureEngineeringService,
  ],
})
export class MLModule { }