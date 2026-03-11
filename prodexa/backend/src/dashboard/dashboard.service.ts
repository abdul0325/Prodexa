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
  async getProjectDashboard(projectId: string, daysThreshold = 7) {
    // 1️⃣ Health Score
    const health = await this.devService.getProjectHealth(projectId);

    // 2️⃣ Leaderboard
    const leaderboard = await this.getProjectLeaderboard(projectId);

    // 3️⃣ Developer Risk
    const developerRisk = await this.devService.getDeveloperRisk(projectId, daysThreshold);

    return {
      projectId,
      healthScore: health.healthScore,
      healthStatus: health.status,
      metrics: health.metrics,
      leaderboard: {
        totals: {
          totalCommits: health.metrics?.totalCommits,
          totalPRs: health.metrics?.totalPRs,
          totalIssues: health.metrics?.totalIssues,
        },
        developers: leaderboard,
      },
      developerRisk: developerRisk.riskDevelopers,
    };
  }

  /**
   * Leaderboard per developer, sorted by productivityScore
   */
  async getProjectLeaderboard(projectId: string) {
    const developers = await this.prisma.developerActivity.findMany({
      where: { projectId },
      orderBy: { productivityScore: 'desc' },
    });

    return developers.map((dev) => ({
      developerLogin: dev.developerLogin,
      commits: dev.commits,
      prs: dev.pullRequestCount,
      issues: dev.issueCount,
      productivityScore: dev.productivityScore,
    }));
  }

  /**
   * Timeline of project activity
   */
  async getActivityTimeline(projectId: string) {
    return this.prisma.projectActivity.findMany({
      where: { projectId },
      orderBy: { activityTimestamp: 'asc' },
      select: {
        activityTimestamp: true,
        commitFrequency: true,
        pullRequestCount: true,
        issueCount: true,
      },
    });
  }
}