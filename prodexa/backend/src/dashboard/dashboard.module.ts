import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeveloperAnalyticsModule } from 'src/developer-analytics/developer-analytics.module';

@Module({
  imports: [PrismaModule, DeveloperAnalyticsModule],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
