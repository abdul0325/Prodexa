/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeveloperAnalyticsService } from 'src/developer-analytics/developer-analytics.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private devService: DeveloperAnalyticsService,
  ) { }

  /**
   * Unified Project Dashboard
   */
  async getProjectDashboard(
    projectId: string,
    daysThreshold = 7,
  ) {

    // Leaderboard
    const leaderboard =
      await this.getProjectLeaderboard(
        projectId,
      );

    // Developer Risk
    const developerRisk =
      await this.devService.getDeveloperRisk(
        projectId,
        daysThreshold,
      );

    // Latest ML Prediction
    const latestPrediction =
      await this.prisma.prediction.findFirst({
        where: {
          projectId,
        },
        orderBy: {
          generatedAt: 'desc',
        },
      });
    console.log('LATEST PREDICTION FROM DB');
    console.log(latestPrediction);

    // Aggregate Metrics
    const developers =
      await this.prisma.developerActivity.findMany({
        where: {
          projectId,
        },
      });

    const totalCommits =
      developers.reduce(
        (sum, dev) => sum + dev.commits,
        0,
      );

    const totalPRs =
      developers.reduce(
        (sum, dev) => sum + dev.pullRequestCount,
        0,
      );

    const totalIssues =
      developers.reduce(
        (sum, dev) => sum + dev.issueCount,
        0,
      );

    return {
      projectId,

      healthScore:
        latestPrediction?.productivityScore || 0,

      healthStatus:
        latestPrediction?.teamHealthStatus || 'UNKNOWN',

      deliveryRisk:
        latestPrediction?.deliveryRisk || 'UNKNOWN',

      confidence:
        latestPrediction?.workloadForecast || 0,

      metrics: {
        totalCommits,
        totalPRs,
        totalIssues,
        totalDevelopers: developers.length,
      },

      prediction:
        latestPrediction,

      leaderboard: {
        totals: {
          totalCommits,
          totalPRs,
          totalIssues,
        },

        developers:
          leaderboard,
      },

      developerRisk:
        developerRisk.riskDevelopers,
    };
  }

  /**
   * Leaderboard per developer
   */
  async getProjectLeaderboard(
    projectId: string,
  ) {

    const developers =
      await this.prisma.developerActivity.findMany({
        where: {
          projectId,
        },
        orderBy: {
          productivityScore: 'desc',
        },
      });

    return developers.map((dev) => ({
      developerLogin:
        dev.developerLogin,

      commits:
        dev.commits,

      prs:
        dev.pullRequestCount,

      issues:
        dev.issueCount,

      productivityScore:
        dev.productivityScore,

      predictedScore:
        dev.predictedScore,
    }));
  }

  /**
   * Activity Timeline
   */
  async getActivityTimeline(
    projectId: string,
  ) {

    return this.prisma.projectActivity.findMany({
      where: {
        projectId,
      },
      orderBy: {
        activityTimestamp: 'asc',
      },
      select: {
        activityTimestamp: true,
        commitFrequency: true,
        pullRequestCount: true,
        issueCount: true,
      },
    });
  }
}