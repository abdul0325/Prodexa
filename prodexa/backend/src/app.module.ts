import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GithubModule } from './github/github.module';
import { ProjectModule } from './project/project.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IntelligenceService } from './intelligence/intelligence.service';
import { DeveloperAnalyticsService } from './developer-analytics/developer-analytics.service';
import { DeveloperAnalyticsController } from './developer-analytics/developer-analytics.controller';
import { DeveloperAnalyticsModule } from './developer-analytics/developer-analytics.module';
import { IntelligenceModule } from './intelligence/intelligence.module';


@Module({
  imports: [PrismaModule, UserModule, AuthModule, GithubModule, ProjectModule, ScheduleModule.forRoot(), DeveloperAnalyticsModule, IntelligenceModule],
  controllers: [AppController, DeveloperAnalyticsController],
  providers: [AppService, IntelligenceService, DeveloperAnalyticsService],
})
export class AppModule {}
