/* eslint-disable prettier/prettier */
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { HttpService }
  from '@nestjs/axios';

import { lastValueFrom }
  from 'rxjs';

import { PrismaService }
  from '../prisma/prisma.service';

import { FeatureEngineeringService }
  from './feature-engineering.service';

@Injectable()
export class MLService {

  constructor(

    private readonly httpService:
      HttpService,

    private readonly prisma:
      PrismaService,

    private readonly featureEngineering:
      FeatureEngineeringService,
  ) { }

  private mlServiceUrl =
    process.env.ML_SERVICE_URL ||
    'http://localhost:8000';

  async analyzeProject(
    projectId: string,
  ) {

    const project =
      await this.prisma.project
        .findUnique({

          where: {
            id: projectId,
          },
        });

    if (!project) {

      throw new HttpException(
        'Project not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // ENGINEERING FEATURE VECTOR

    const features =
      await this.featureEngineering
        .generateProjectFeatures(
          projectId,
        );

    const payload = {

      projectId:
        project.id,

      projectName:
        project.name,

      features,
    };

    console.log(
      'ML FEATURES:',
      payload.features,
    );

    try {

      const response$ =
        this.httpService.post(

          `${this.mlServiceUrl}/predict`,

          payload,

          {
            timeout: 15000,
          },
        );

      const response =
        await lastValueFrom(
          response$,
        );

      const predictions =
        response.data;

      console.log(
        'ML PREDICTION:',
        predictions,
      );

      // SAVE PREDICTION

      await this.prisma.prediction
        .create({

          data: {

            projectId,

            productivityScore:
              predictions.projectScore,

            deliveryRisk:
              predictions.deliveryRisk,

            workloadForecast:
              predictions.forecastConfidence || 0,
          },
        });

      return predictions;

    } catch (error) {

      console.error(
        'ML SERVICE ERROR:',
        error.message,
      );

      throw new HttpException(

        'ML service request failed — make sure FastAPI is running on port 5000',

        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async checkHealth() {

    try {

      const response$ =
        this.httpService.get(
          `${this.mlServiceUrl}/health`,
        );

      const response =
        await lastValueFrom(
          response$,
        );

      return response.data;

    } catch {

      return {

        status: 'unreachable',

        url: this.mlServiceUrl,
      };
    }
  }
}