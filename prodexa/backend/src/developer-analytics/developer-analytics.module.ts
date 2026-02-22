import { Module } from '@nestjs/common';
import { DeveloperAnalyticsService } from './developer-analytics.service';
import { DeveloperAnalyticsController } from './developer-analytics.controller';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [PrismaModule, GithubModule],
  controllers: [DeveloperAnalyticsController],
  providers: [DeveloperAnalyticsService],
  exports: [DeveloperAnalyticsService],
})
export class DeveloperAnalyticsModule {}
