import { Module } from '@nestjs/common';
import { DeveloperAnalyticsService } from './developer-analytics.service';
import { DeveloperAnalyticsController } from './developer-analytics.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [PrismaModule, GithubModule],
  controllers: [DeveloperAnalyticsController],
  providers: [DeveloperAnalyticsService],
  exports: [DeveloperAnalyticsService],
})
export class DeveloperAnalyticsModule {}
