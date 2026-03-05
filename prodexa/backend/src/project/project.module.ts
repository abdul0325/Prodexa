import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { GithubModule } from 'src/github/github.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeveloperAnalyticsModule } from 'src/developer-analytics/developer-analytics.module';
import { AnalyticsQueueModule } from 'src/analytics-queue/analytics-queue.module';

@Module({
  imports: [DeveloperAnalyticsModule,GithubModule, PrismaModule, AnalyticsQueueModule], 
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule {}
