/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MLService } from './ml.service';
import { MLController } from './ml.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

import { FeatureEngineeringService }
  from './feature-engineering.service';
import { TrainingDataService } from './training-data.service';
import { SyntheticDatasetService } from './synthetic-dataset.service';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
  ],

  providers: [
    MLService,
    FeatureEngineeringService,
    TrainingDataService,
    SyntheticDatasetService,
  ],

  controllers: [
    MLController,
  ],

  exports: [
    FeatureEngineeringService,
    MLService,
  ],
})
export class MLModule { }