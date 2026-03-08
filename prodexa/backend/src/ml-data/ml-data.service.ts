import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MLDataService {
  constructor(private prisma: PrismaService) {}

  // Project-level data
  async getProjectData(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { developerActivities: true },
    });

    if (!project) throw new Error('Project not found');

    const devActivities = project.developerActivities;

    const totalCommits = devActivities.reduce((sum, d) => sum + d.commits, 0);
    const totalPRs = devActivities.reduce((sum, d) => sum + d.pullRequestCount, 0);
    const totalIssues = devActivities.reduce((sum, d) => sum + d.issueCount, 0);
    const avgProductivity = devActivities.length
      ? Math.round(devActivities.reduce((sum, d) => sum + d.productivityScore, 0) / devActivities.length)
      : 0;

    return {
      projectId: project.id,
      projectName: project.name,
      totalDevelopers: devActivities.length,
      avgProductivity,
      totalCommits,
      totalPRs,
      totalIssues,
    };
  }

  // Developer-level data
  async getDeveloperData(projectId: string) {
    const devActivities = await this.prisma.developerActivity.findMany({
      where: { projectId },
      orderBy: { activityTimestamp: 'asc' },
    });

    return devActivities.map(d => ({
      developerLogin: d.developerLogin,
      commits: d.commits,
      pullRequestCount: d.pullRequestCount,
      issueCount: d.issueCount,
      productivityScore: d.productivityScore,
      activityTimestamp: d.activityTimestamp,
    }));
  }
}