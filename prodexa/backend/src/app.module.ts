/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './prisma/users/user.module';
import { AuthModule } from './prisma/auth/auth.module';
import { GithubModule } from './github/github.module';
import { ProjectModule } from './prisma/projects/project.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DeveloperAnalyticsModule } from './developer-analytics/developer-analytics.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { AnalyticsQueueModule } from './analytics/analytics.module';
import { BullModule } from '@nestjs/bullmq';
import { DashboardModule } from './presentation/presentation.module';
import { MLDataModule } from './ml-data/ml-data.module';
import { MLModule } from './ml/ml.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './prisma/notifications/notifications.module';
import { GatewayModule } from './gateway/gateway.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { GithubWebhooksModule } from './github/webhooks/github-webhooks.module';
import { ManagerModule } from './manager/manager.module';

@Module({
  imports: [
    // Redis — used for caching + BullMQ
    RedisModule.forRoot({

      type: 'single',

      options: {

        host:
          process.env.REDIS_HOST,

        port: parseInt(
          process.env.REDIS_PORT || '6379',
        ),

        password:
          process.env.REDIS_PASSWORD,

        tls: {},

        maxRetriesPerRequest: null,
      },
    }),

    // BullMQ job queue
    BullModule.forRoot({

      connection: {

        host:
          process.env.REDIS_HOST,

        port: parseInt(
          process.env.REDIS_PORT || '6379',
        ),

        password:
          process.env.REDIS_PASSWORD,

        tls: {},
      },
    }),

    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    GithubModule,
    ProjectModule,
    DeveloperAnalyticsModule,
    IntelligenceModule,
    AnalyticsQueueModule,
    DashboardModule,
    MLDataModule,
    MLModule,
    AdminModule,
    NotificationsModule,
    GatewayModule,
    GithubWebhooksModule,
    ManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
