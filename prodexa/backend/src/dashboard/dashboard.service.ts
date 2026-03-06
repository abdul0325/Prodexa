import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getProjectDashboard(projectId: string) {

        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        const activities = await this.prisma.projectActivity.findMany({
            where: { projectId },
        });

        const developers = await this.prisma.developerActivity.findMany({
            where: { projectId },
        });

        const predictions = await this.prisma.prediction.findFirst({
            where: { projectId },
            orderBy: { generatedAt: 'desc' },
        });

        const totalCommits = developers.reduce((sum, d) => sum + d.commits, 0);
        const totalPRs = developers.reduce((sum, d) => sum + d.pullRequestCount, 0);
        const totalIssues = developers.reduce((sum, d) => sum + d.issueCount, 0);

        const avgProductivity =
            developers.length === 0
                ? 0
                : Math.round(
                    developers.reduce((sum, d) => sum + d.productivityScore, 0) /
                    developers.length,
                );

        return {
            projectName: project?.name,
            totalCommits,
            totalPRs,
            totalIssues,
            contributorCount: developers.length,
            avgProductivity,
            deliveryRisk: predictions?.deliveryRisk ?? 'Unknown',
        };
    }

    async getDeveloperLeaderboard(projectId: string) {

        const developers = await this.prisma.developerActivity.findMany({
            where: { projectId },
            orderBy: { productivityScore: 'desc' },
        });

        return developers.map((dev) => ({
            developerLogin: dev.developerLogin,
            commits: dev.commits,
            pullRequests: dev.pullRequestCount,
            issues: dev.issueCount,
            productivityScore: dev.productivityScore,
        }));
    }

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

    async getLeaderboard(projectId: string) {
        return this.prisma.developerActivity.findMany({
            where: {
                projectId: projectId,
            },
            orderBy: {
                productivityScore: 'desc',
            },
        });
    }
}