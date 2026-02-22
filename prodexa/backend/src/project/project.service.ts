import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { GitHubCommit, GitHubPull, GitHubIssue } from '../github/github.types';
import { randomUUID } from 'crypto';

@Injectable()
export class ProjectService {
    constructor(
        private prisma: PrismaService,
        private githubService: GithubService,
    ) { }

    // 1️⃣ Create a project
    async createProject(userId: string, data: { name: string; repoUrl: string; ownerName: string }) {
        return this.prisma.project.create({
            data: { ...data, userId },
        });
    }

    // 2️⃣ Get user's projects
    async getUserProjects(userId: string) {
        return this.prisma.project.findMany({ where: { userId } });
    }

    // 3️⃣ Analyze project & store project-level activity
    async analyzeProject(userId: string, projectId: string, since: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.userId !== userId) throw new Error('Project not found');

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.passwordHash) throw new Error('GitHub token not found');

        const [owner, repo] = project.repoUrl.split('github.com/')[1].split('/');

        // Fetch GitHub data
        const commits = (await this.githubService.getCommitsFromProject(owner, repo, user.passwordHash, since)) as GitHubCommit[];
        const pulls = (await this.githubService.getPullRequestsFromProject(owner, repo, user.passwordHash)) as GitHubPull[];
        const issues = (await this.githubService.getIssuesFromProject(owner, repo, user.passwordHash)) as GitHubIssue[];

        // Aggregate metrics
        const contributors = Array.from(new Set(commits.map(c => c.author?.login).filter(Boolean) as string[]));

        const rawScore =
            commits.length * 0.4 +
            pulls.length * 0.3 +
            contributors.length * 0.2 -
            issues.length * 0.1;

        const productivityScore = Math.max(0, Math.min(100, Math.round(rawScore)));

        // Save overall project activity
        const activity = await this.prisma.projectActivity.create({
            data: {
                commitFrequency: commits.length,
                pullRequestCount: pulls.length,
                issueCount: issues.length,
                contributorCount: contributors.length,
                activityTimestamp: new Date(),
                projectId,
                productivityScore,
            },
        });

        // --- Developer-level analytics ---
        const devAnalytics = contributors.map(login => {
            const userCommits = commits.filter(c => c.author?.login === login).length;
            const userPRs = pulls.filter(p => p.user?.login === login).length;
            const userIssues = issues.filter(i => i.user?.login === login).length;

            const devScore = Math.max(0, Math.min(100, Math.round(userCommits * 0.4 + userPRs * 0.3 - userIssues * 0.1)));

            return {
                id: randomUUID(),
                developerLogin: login,
                commits: userCommits,
                pullRequestCount: userPRs,
                issueCount: userIssues,
                productivityScore: devScore,
                activityTimestamp: new Date(),
                projectId,
            };
        });

        await this.prisma.developerActivity.createMany({
            data: devAnalytics,
            skipDuplicates: true,
        });

        return activity;
    }

    // 4️⃣ Get project analytics
    async getProjectAnalytics(userId: string, projectId: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.userId !== userId) throw new Error('Project not found');

        return this.prisma.projectActivity.findMany({
            where: { projectId },
            orderBy: { activityTimestamp: 'asc' },
        });
    }

    // 5️⃣ Get project summary (trend + risk)
    async getProjectSummary(userId: string, projectId: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project || project.userId !== userId) throw new Error('Project not found');

        const activities = await this.prisma.projectActivity.findMany({
            where: { projectId },
            orderBy: { activityTimestamp: 'desc' },
            take: 2,
        });

        if (!activities.length) return { message: 'No analytics yet' };

        const latest = activities[0];
        const previous = activities[1];
        const latestScore = latest.productivityScore ?? 0;
        const previousScore = previous?.productivityScore ?? 0;

        const trend = previous ? (latestScore > previousScore ? 'up' : latestScore < previousScore ? 'down' : 'stable') : 'stable';
        const riskLevel = latestScore < 30 ? 'High' : latestScore < 60 ? 'Medium' : 'Low';

        return { latestMetrics: latest, trend, riskLevel };
    }
}
