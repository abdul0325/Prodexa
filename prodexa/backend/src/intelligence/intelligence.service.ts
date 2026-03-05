import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IntelligenceService {
  constructor(private prisma: PrismaService) { }

  // Predict project-level metrics
  async predictProject(projectId: string) {
    const activities = await this.prisma.projectActivity.findMany({
      where: { projectId },
      orderBy: { activityTimestamp: 'asc' },
    });

    if (!activities.length) return null;

    // Simple linear regression over time
    const prediction = this.simpleLinearForecast(activities.map(a => a.productivityScore ?? 0));

    // Compute risk level
    const risk = prediction < 30 ? 'High' : prediction < 60 ? 'Medium' : 'Low';

    // Workload forecast = based on past commits + PRs (simplified)
    const avgCommits = activities.reduce((sum, a) => sum + a.commitFrequency, 0) / activities.length;
    const avgPRs = activities.reduce((sum, a) => sum + a.pullRequestCount, 0) / activities.length;
    const workloadForecast = avgCommits + avgPRs;

    // Save predictions
    const record = await this.prisma.prediction.create({
      data: {
        projectId,
        productivityScore: prediction,
        deliveryRisk: risk,
        workloadForecast,
      },
    });

    return record;
  }

  // Predict developer-level productivity
  async predictDeveloper(developerLogin: string, projectId: string) {
    const devActivities = await this.prisma.developerActivity.findMany({
      where: { projectId, developerLogin },
      orderBy: { activityTimestamp: 'asc' },
    });

    if (!devActivities.length) return null;

    const predictedScore = this.simpleLinearForecast(devActivities.map(d => d.productivityScore));

    return { developerLogin, predictedScore };
  }

  /**
   * Simple linear forecast: take last N points, calculate slope, predict next point
   */
  private simpleLinearForecast(values: number[]): number {
    const n = values.length;
    if (n < 2) return values[n - 1] ?? 0;

    const xMean = (n - 1) / 2; // 0,1,2,...n-1
    const yMean = values.reduce((sum, v) => sum + v, 0) / n;

    let num = 0;
    let den = 0;
    values.forEach((y, i) => {
      num += (i - xMean) * (y - yMean);
      den += (i - xMean) ** 2;
    });

    const slope = num / (den || 1);
    const predicted = values[n - 1] + slope; // next point

    return Math.max(0, Math.min(100, Math.round(predicted)));
  }

  async getProjectInsights(projectId: string) {
    const activities = await this.prisma.projectActivity.findMany({
      where: { projectId },
      orderBy: { activityTimestamp: 'desc' },
      take: 30,
    });

    if (!activities.length) return null;

    const avgProductivity =
      activities.reduce((sum, a) => sum + (a.productivityScore ?? 0), 0) /
      activities.length;

    const totalCommits = activities.reduce(
      (sum, a) => sum + a.commitFrequency,
      0,
    );

    const totalPRs = activities.reduce(
      (sum, a) => sum + a.pullRequestCount,
      0,
    );

    const totalIssues = activities.reduce(
      (sum, a) => sum + a.issueCount,
      0,
    );

    return {
      projectId,
      avgProductivity: Math.round(avgProductivity),
      totalCommits,
      totalPRs,
      totalIssues,
      activityPoints: activities.length,
    };
  }

  async getDeveloperLeaderboard(projectId: string) {
    const devs = await this.prisma.developerActivity.findMany({
      where: { projectId },
    });

    const leaderboard = Object.values(
      devs.reduce((acc: any, dev) => {
        if (!acc[dev.developerLogin]) {
          acc[dev.developerLogin] = {
            developerLogin: dev.developerLogin,
            commits: 0,
            pullRequests: 0,
            productivity: 0,
            count: 0,
          };
        }

        acc[dev.developerLogin].commits += dev.commits;
        acc[dev.developerLogin].pullRequests += dev.pullRequestCount;
        acc[dev.developerLogin].productivity += dev.productivityScore;
        acc[dev.developerLogin].count += 1;

        return acc;
      }, {}),
    ).map((dev: any) => ({
      developerLogin: dev.developerLogin,
      commits: dev.commits,
      pullRequests: dev.pullRequests,
      productivity: Math.round(dev.productivity / dev.count),
    }));

    return leaderboard.sort((a, b) => b.productivity - a.productivity);
  }
}
