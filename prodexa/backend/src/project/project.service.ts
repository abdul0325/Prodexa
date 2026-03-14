import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { GitHubCommit, GitHubPull, GitHubIssue } from '../github/github.types';
import { randomUUID } from 'crypto';
import { AnalyticsQueueService } from 'src/analytics-queue/analytics-queue.service';
import { CreateProjectDto } from './dto/create-project.dto';

// Shared scoring formula — single source of truth
export function calcProductivityScore(commits: number, prs: number, issues: number): number {
  return Math.max(0, Math.min(100, Math.round(commits * 0.5 + prs * 0.3 + issues * 0.2)));
}

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
    private analyticsQueueService: AnalyticsQueueService,
  ) {}

  // 1️⃣ Create a project
  async createProject(createProjectDto: CreateProjectDto, userId: string) {
    const project = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        repoUrl: createProjectDto.repoUrl,
        ownerName: createProjectDto.ownerName,
        user: {
          connect: { id: userId },
        },
      },
    });

    // Queue analysis job after project creation
    await this.analyticsQueueService.addProjectAnalysisJob(project.id);

    return project;
  }

  // 2️⃣ Get user's projects
  async getUserProjects(userId: string) {
    return this.prisma.project.findMany({ where: { userId } });
  }

  // 3️⃣ Analyze project & store project-level activity
  async analyzeProject(userId: string, projectId: string, since: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== userId) throw new NotFoundException('Project not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    // FIX: use githubToken instead of passwordHash
    if (!user?.githubToken) throw new NotFoundException('GitHub token not found');

    const [owner, repo] = project.repoUrl.split('github.com/')[1].split('/');

    const commits = (await this.githubService.getCommitsFromProject(owner, repo, user.githubToken, since)) as GitHubCommit[];
    const pulls = (await this.githubService.getPullRequestsFromProject(owner, repo, user.githubToken)) as GitHubPull[];
    const issues = (await this.githubService.getIssuesFromProject(owner, repo, user.githubToken)) as GitHubIssue[];

    const contributors = Array.from(
      new Set(commits.map((c) => c.author?.login).filter(Boolean) as string[]),
    );

    // FIX: use shared scoring formula
    const productivityScore = calcProductivityScore(commits.length, pulls.length, issues.length);

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

    const devAnalytics = contributors.map((login) => {
      const userCommits = commits.filter((c) => c.author?.login === login).length;
      const userPRs = pulls.filter((p) => p.user?.login === login).length;
      const userIssues = issues.filter((i) => i.user?.login === login).length;

      return {
        id: randomUUID(),
        developerLogin: login,
        commits: userCommits,
        pullRequestCount: userPRs,
        issueCount: userIssues,
        // FIX: use shared scoring formula
        productivityScore: calcProductivityScore(userCommits, userPRs, userIssues),
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
    if (!project || project.userId !== userId) throw new NotFoundException('Project not found');

    return this.prisma.projectActivity.findMany({
      where: { projectId },
      orderBy: { activityTimestamp: 'asc' },
    });
  }

  // 5️⃣ Get project summary (trend + risk)
  async getProjectSummary(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== userId) throw new NotFoundException('Project not found');

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

    const trend = previous
      ? latestScore > previousScore
        ? 'up'
        : latestScore < previousScore
          ? 'down'
          : 'stable'
      : 'stable';

    const riskLevel = latestScore < 30 ? 'High' : latestScore < 60 ? 'Medium' : 'Low';

    return { latestMetrics: latest, trend, riskLevel };
  }
}
