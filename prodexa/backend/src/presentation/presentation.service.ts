/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeveloperAnalyticsService } from 'src/developer-analytics/developer-analytics.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private devService: DeveloperAnalyticsService,
  ) {}

  /**
   * Unified Project Dashboard
   */
  async getProjectDashboard(
    projectId: string,
    daysThreshold = 7,
  ) {

    // ML Health
    const health =
      await this.devService.getProjectHealth(
        projectId,
      );

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

      // ML Health
      healthScore:
        health.healthScore,

      healthStatus:
        health.status,

      deliveryRisk:
        health.deliveryRisk,

      confidence:
        health.confidence,

      // Engineering Metrics
      metrics: {
        totalCommits,
        totalPRs,
        totalIssues,
        totalDevelopers:
          developers.length,
      },

      // Latest ML Record
      prediction:
        latestPrediction,

      // Leaderboard
      leaderboard: {
        totals: {
          totalCommits,
          totalPRs,
          totalIssues,
        },
        developers:
          leaderboard,
      },

      // Developer Risk
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