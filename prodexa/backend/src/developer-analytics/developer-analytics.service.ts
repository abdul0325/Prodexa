/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { parseRepoUrl } from 'src/github/utils/parse-repo.util';
import { calcProductivityScore } from 'src/prisma/projects/project.service';
import { CommitService } from 'src/analytics/services/commit.service';
import { CommitFileChangeService } from 'src/analytics/services/commit-file-change.service';
import { GithubCommitDetailsService } from 'src/github/services/github-commit-details.service';
import { ImpactAnalysisService } from 'src/intelligence/code-analysis/impact-analysis.service';

@Injectable()
export class DeveloperAnalyticsService {
  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
    private commitService: CommitService,
    private commitFileChangeService: CommitFileChangeService,
    private githubCommitDetails: GithubCommitDetailsService,
    private impactAnalysis: ImpactAnalysisService,
  ) { }

  async analyzeDevelopers(
    projectId: string,
    token: string,
    _since: string,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const repoPath =
      project.repoUrl.split('github.com/')[1];

    const [owner, repo] =
      repoPath.replace('.git', '').split('/');

    const contributors =
      await this.githubService.getContributors(
        owner,
        repo,
        token,
      );

    const [commits, pulls, issues] =
      await Promise.all([
        this.githubService.getAllCommits(
          owner,
          repo,
          token,
        ),

        this.githubService.getAllPullRequests(
          owner,
          repo,
          token,
        ),

        this.githubService.getAllIssues(
          owner,
          repo,
          token,
        ),
      ]);

    // Incremental analysis
    const newCommits: any[] = [];

    for (const commit of commits) {

      if (
        project.lastAnalyzedCommitSha &&
        commit.sha ===
        project.lastAnalyzedCommitSha
      ) {
        break;
      }

      newCommits.push(commit);

    }

    console.log(
      `NEW COMMITS TO ANALYZE: ${newCommits.length}`,
    );

    for (const commit of newCommits) {

      try {

        if (!commit.commit?.author) {
          continue;
        }

        const exists =
          await this.commitService.commitExists(
            commit.sha,
          );

        if (exists) {

          console.log(
            'SKIPPING EXISTING COMMIT:',
            commit.sha,
          );

          continue;
        }

        await this.commitService.storeCommits({
          repository: {
            id: projectId,
            fullName: `${owner}/${repo}`,
          },

          author: {
            login:
              commit.author?.login ||
              'unknown',
          },

          branch: 'main',

          commits: [
            {
              sha: commit.sha,

              message:
                commit.commit.message,

              url:
                `https://github.com/${owner}/${repo}/commit/${commit.sha}`,

              timestamp:
                commit.commit.author.date,
            },
          ],
        });

        const details =
          await this.githubCommitDetails
            .fetchCommitDetails(
              owner,
              repo,
              commit.sha,
            );

        await this.commitFileChangeService
          .storeCommitFiles(
            commit.sha,
            details.files || [],
          );

        await this.impactAnalysis
          .analyzeCommit(
            commit.sha,
          );

      } catch (error: any) {

        console.error(
          'FAILED COMMIT:',
          commit.sha,
        );

        console.error(
          error?.message,
        );
      }

    }

    const devAnalytics =
      contributors.map(
        (contributor) => {

          const login =
            contributor.login;

          const userCommits =
            commits.filter(
              (c) =>
                c.author?.login === login,
            ).length;

          const userPRs =
            pulls.filter(
              (p) =>
                p.user?.login === login,
            ).length;

          const userIssues =
            issues.filter(
              (i) =>
                i.user?.login === login &&
                !i.pull_request,
            ).length;

          return {
            developerLogin: login,

            commits:
              userCommits,

            pullRequestCount:
              userPRs,

            issueCount:
              userIssues,

            productivityScore:
              calcProductivityScore(
                userCommits,
                userPRs,
                userIssues,
              ),

            activityTimestamp:
              new Date(),

            projectId,
          };
        },
      );

    for (const dev of devAnalytics) {

      await this.prisma
        .developerActivity
        .upsert({

          where: {
            developerLogin_projectId:
            {
              developerLogin:
                dev.developerLogin,

              projectId,
            },
          },

          update: {
            commits:
              dev.commits,

            pullRequestCount:
              dev.pullRequestCount,

            issueCount:
              dev.issueCount,

            productivityScore:
              dev.productivityScore,

            activityTimestamp:
              dev.activityTimestamp,
          },

          create: dev,
        });

    }

    return devAnalytics;
  }

  async analyzeProjectContributors(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true }, // ← include user to get their token
    });
    if (!project) throw new NotFoundException('Project not found');

    const { owner, repo } = parseRepoUrl(project.repoUrl);

    // Use user's own GitHub token for better rate limits & private repo access
    const token = project.user?.githubToken;

    if (!token) {
      throw new NotFoundException('GitHub token not found');
    }

    const [contributors, commits, prs, issues] = await Promise.all([
      this.githubService.getContributors(owner, repo, token),
      this.githubService.getAllCommits(owner, repo, token),
      this.githubService.getAllPullRequests(owner, repo, token),
      this.githubService.getAllIssues(owner, repo, token),
    ]);

    const tasks = contributors.map(async (contributor) => {
      const commitCount = commits.filter(
        (c) =>
          c.author?.login === contributor.login ||
          c.commit?.author?.name === contributor.login, // fallback
      ).length;

      const prCount = prs.filter(
        (p) => p.user?.login === contributor.login,
      ).length;

      const issueCount = issues.filter(
        (i) => i.user?.login === contributor.login && !i.pull_request, // exclude PRs counted as issues
      ).length;

      const productivityScore = calcProductivityScore(
        commitCount,
        prCount,
        issueCount,
      );

      return this.prisma.developerActivity.upsert({
        where: {
          developerLogin_projectId: {
            developerLogin: contributor.login,
            projectId,
          },
        },
        update: {
          commits: commitCount,
          pullRequestCount: prCount,
          issueCount,
          productivityScore,
          activityTimestamp: new Date(),
        },
        create: {
          developerLogin: contributor.login,
          projectId,
          commits: commitCount,
          pullRequestCount: prCount,
          issueCount,
          productivityScore,
        },
      });
    });

    await Promise.all(tasks);

    return {
      message: 'Contributors analyzed and saved',
      count: contributors.length,
    };
  }

  async getDeveloperAnalytics(projectId: string, developerLogin?: string) {
    return this.prisma.developerActivity.findMany({
      where: { projectId, developerLogin: developerLogin || undefined },
      orderBy: { activityTimestamp: 'asc' },
    });
  }

  async predictProject(projectId: string) {
    const devs = await this.prisma.developerActivity.findMany({
      where: { projectId },
    });
    if (!devs.length) return { message: 'No analytics data found for project' };

    const avgScore =
      devs.reduce((sum, d) => sum + d.productivityScore, 0) / devs.length;

    const predictedHealth =
      avgScore > 80
        ? 'Excellent'
        : avgScore > 60
          ? 'Good'
          : avgScore > 40
            ? 'Average'
            : 'Low';

    return {
      projectId,
      developerCount: devs.length,
      averageProductivity: avgScore,
      predictedHealth,
    };
  }

  async predictDeveloper(developerLogin: string, projectId: string) {
    const dev = await this.prisma.developerActivity.findFirst({
      where: { developerLogin, projectId },
    });

    if (!dev) return { message: 'Developer analytics not found' };

    const predictedScore = calcProductivityScore(
      dev.commits,
      dev.pullRequestCount,
      dev.issueCount,
    );

    await this.prisma.developerActivity.update({
      where: { developerLogin_projectId: { developerLogin, projectId } },
      data: { predictedScore },
    });

    return { developerLogin, projectId, predictedScore };
  }

async getProjectHealth(projectId: string) {

  const prediction =
    await this.prisma.prediction.findFirst({
      where: {
        projectId,
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });

  if (!prediction) {
    return {
      projectId,
      healthScore: 0,
      status: 'UNKNOWN',
    };
  }

  return {
    projectId,
    healthScore:
      prediction.productivityScore,

    status:
      prediction.teamHealthStatus,

    deliveryRisk:
      prediction.deliveryRisk,

    confidence:
      prediction.workloadForecast,
  };
}

  async getProjectLeaderboard(projectId: string) {
    const developers = await this.prisma.developerActivity.findMany({
      where: { projectId },
    });
    if (!developers.length) return { message: 'No developer data found' };

    const leaderboard = developers
      .map((dev) => ({
        developer: dev.developerLogin,
        commits: dev.commits,
        prs: dev.pullRequestCount,
        issues: dev.issueCount,
        score: calcProductivityScore(
          dev.commits,
          dev.pullRequestCount,
          dev.issueCount,
        ),
      }))
      .sort((a, b) => b.score - a.score);

    return { projectId, leaderboard };
  }

  async getDeveloperRisk(projectId: string, daysThreshold = 7) {
    const now = new Date();
    const activities = await this.prisma.developerActivity.findMany({
      where: { projectId },
      orderBy: { activityTimestamp: 'desc' },
    });

    if (!activities.length)
      return { message: 'No developer activity found for this project' };

    const developerLastActivityMap: Record<string, Date> = {};
    activities.forEach((activity) => {
      const login = activity.developerLogin;
      if (
        !developerLastActivityMap[login] ||
        developerLastActivityMap[login] < activity.activityTimestamp
      ) {
        developerLastActivityMap[login] = activity.activityTimestamp;
      }
    });

    const riskDevelopers = Object.entries(developerLastActivityMap)
      .map(([developer, lastActive]) => {
        const daysSinceLastCommit = Math.floor(
          (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
        );
        return {
          developer,
          lastActive: lastActive.toISOString(),
          daysSinceLastCommit,
          risk: daysSinceLastCommit > daysThreshold ? 'Inactive' : 'Active',
        };
      })
      .sort((a, b) => b.daysSinceLastCommit - a.daysSinceLastCommit);

    return { projectId, riskDevelopers };
  }
}
