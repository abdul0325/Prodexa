import { Module } from '@nestjs/common';
import { DeveloperAnalyticsService } from './developer-analytics.service';
import { DeveloperAnalyticsController } from './developer-analytics.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GithubModule } from 'src/github/github.module';
import { CommitService } from 'src/analytics/services/commit.service';
import { CommitFileChangeService } from 'src/analytics/services/commit-file-change.service';
import { IntelligenceModule } from 'src/intelligence/intelligence.module';

@Module({
  imports: [PrismaModule, GithubModule, IntelligenceModule],
  controllers: [DeveloperAnalyticsController],
  providers: [
    DeveloperAnalyticsService,
    CommitService,
    CommitFileChangeService,
  ],
  exports: [DeveloperAnalyticsService],
})
export class DeveloperAnalyticsModule { }
