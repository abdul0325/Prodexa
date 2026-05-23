import { Module } from '@nestjs/common';
import { DashboardService } from './presentation.service';
import { DashboardController } from './presentation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DeveloperAnalyticsModule } from 'src/developer-analytics/developer-analytics.module';

@Module({
  imports: [PrismaModule, DeveloperAnalyticsModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
