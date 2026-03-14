import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GithubModule } from './github/github.module';
import { ProjectModule } from './project/project.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DeveloperAnalyticsModule } from './developer-analytics/developer-analytics.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { AnalyticsQueueModule } from './analytics-queue/analytics-queue.module';
import { BullModule } from '@nestjs/bullmq';
import { DashboardModule } from './dashboard/dashboard.module';
import { MLDataModule } from './ml-data/ml-data.module';
import { MLModule } from './ml/ml.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    GithubModule,
    ProjectModule,
    ScheduleModule.forRoot(),
    DeveloperAnalyticsModule,
    IntelligenceModule,
    AnalyticsQueueModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    DashboardModule,
    MLDataModule,
    MLModule,
    AdminModule,         // NEW
    NotificationsModule, // NEW
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
