import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { GitHubCommit, GitHubPull, GitHubIssue } from '../github/github.types';
import { randomUUID } from 'crypto';
import { parseRepoUrl } from 'src/github/utils/parse-repo.util';

@Injectable()
export class DeveloperAnalyticsService {
    constructor(
        private prisma: PrismaService,
        private githubService: GithubService,
    ) { }

    async analyzeDevelopers(
        projectId: string,
        token: string,
        since: string,
    ) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) throw new Error('Project not found');

        if (!project.repoUrl.includes('github.com')) {
            throw new Error('Invalid GitHub repository URL');
        }

        const repoPath = project.repoUrl.split('github.com/')[1];
        const [owner, repo] = repoPath.replace('.git', '').split('/');

        const contributors = await this.githubService.getContributors(
            owner,
            repo,
        );

        const commits = await this.githubService.getCommitsFromProject(
            owner,
            repo,
            token,
            since,
        );

        const pulls = await this.githubService.getPullRequestsFromProject(
            owner,
            repo,
            token,
        );

        const issues = await this.githubService.getIssuesFromProject(
            owner,
            repo,
            token,
        );

        const devAnalytics = contributors.map((contributor) => {
            const login = contributor.login;

            const userCommits = commits.filter(
                (c) => c.author?.login === login,
            ).length;

            const userPRs = pulls.filter(
                (p) => p.user?.login === login,
            ).length;

            const userIssues = issues.filter(
                (i) => i.user?.login === login,
            ).length;

            // Improved scoring formula
            const productivityScore = Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        userCommits * 5 +
                        userPRs * 8 -
                        userIssues * 2
                    ),
                ),
            );

            return {
                id: randomUUID(),
                developerLogin: login,
                commits: userCommits,
                pullRequestCount: userPRs,
                issueCount: userIssues,
                productivityScore,
                activityTimestamp: new Date(),
                projectId,
            };
        });

        await this.prisma.developerActivity.createMany({
            data: devAnalytics,
            skipDuplicates: true,
        });

        return devAnalytics;
    }


    async getDeveloperAnalytics(projectId: string, developerLogin?: string) {
        return this.prisma.developerActivity.findMany({
            where: {
                projectId,
                developerLogin: developerLogin || undefined,
            },
            orderBy: { activityTimestamp: 'asc' },
        });
    }

    async analyzeProjectContributors(projectId: string) {

        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new Error("Project not found");
        }

        const { owner, repo } = parseRepoUrl(project.repoUrl);

        const contributors = await this.githubService.getContributors(owner, repo);

        const commits = await this.githubService.getAllCommits(owner, repo);
        const prs = await this.githubService.getAllPullRequests(owner, repo);
        const issues = await this.githubService.getAllIssues(owner, repo);

        const tasks = contributors.map(async (contributor) => {

            const commitCount = commits.filter(
                (c) => c.author?.login === contributor.login
            ).length;

            const prCount = prs.filter(
                (p) => p.user?.login === contributor.login
            ).length;

            const issueCount = issues.filter(
                (i) => i.user?.login === contributor.login
            ).length;

            const productivityScore =
                commitCount * 2 +
                prCount * 5 +
                issueCount * 3;

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
            message: "Contributors analyzed and saved",
            count: contributors.length,
        };
    }

    // -------------------- Intelligence Methods --------------------

    async predictProject(projectId: string) {
        const devs = await this.prisma.developerActivity.findMany({
            where: { projectId },
        });

        if (!devs.length) {
            return { message: 'No analytics data found for project' };
        }

        const totalScore = devs.reduce((sum, d) => sum + d.productivityScore, 0);

        const avgScore = totalScore / devs.length;

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

        if (!dev) {
            return { message: 'Developer analytics not found' };
        }

        const predictedScore =
            dev.commits * 3 +
            dev.pullRequestCount * 5 +
            dev.issueCount * 2;

        await this.prisma.developerActivity.update({
            where: {
                developerLogin_projectId: {
                    developerLogin,
                    projectId,
                },
            },
            data: {
                predictedScore,
            },
        });

        return {
            developerLogin,
            projectId,
            predictedScore,
        };
    }

    async getProjectHealth(projectId: string) {
        const activities = await this.prisma.developerActivity.findMany({
            where: { projectId },
        });

        if (!activities.length) {
            return { message: 'No analytics found for this project' };
        }

        let totalCommits = 0;
        let totalPRs = 0;
        let totalIssues = 0;

        for (const dev of activities) {
            totalCommits += dev.commits;
            totalPRs += dev.pullRequestCount;
            totalIssues += dev.issueCount;
        }

        const activeDevelopers = activities.length;

        // Normalization thresholds (reasonable limits)
        const commitScore = Math.min((totalCommits / 500) * 100, 100);
        const prScore = Math.min((totalPRs / 200) * 100, 100);
        const issueScore = Math.min((totalIssues / 200) * 100, 100);
        const devScore = Math.min((activeDevelopers / 20) * 100, 100);

        const healthScore =
            commitScore * 0.3 +
            prScore * 0.3 +
            issueScore * 0.2 +
            devScore * 0.2;

        let status = 'Risky';

        if (healthScore >= 80) status = 'Excellent';
        else if (healthScore >= 60) status = 'Healthy';
        else if (healthScore >= 40) status = 'Moderate';

        return {
            projectId,
            healthScore: Math.round(healthScore),
            status,
            metrics: {
                totalCommits,
                totalPRs,
                totalIssues,
                activeDevelopers,
            },
        };
    }

    async getProjectLeaderboard(projectId: string) {
        const developers = await this.prisma.developerActivity.findMany({
            where: { projectId },
        });

        if (!developers.length) {
            return { message: 'No developer data found' };
        }

        const leaderboard = developers
            .map((dev) => {
                const commitScore = Math.min((dev.commits / 100) * 100, 100);
                const prScore = Math.min((dev.pullRequestCount / 100) * 100, 100);
                const issueScore = Math.min((dev.issueCount / 50) * 100, 100);

                const score =
                    commitScore * 0.5 +
                    prScore * 0.3 +
                    issueScore * 0.2;

                return {
                    developer: dev.developerLogin,
                    commits: dev.commits,
                    prs: dev.pullRequestCount,
                    issues: dev.issueCount,
                    score: Math.round(score),
                };
            })
            .sort((a, b) => b.score - a.score);

        return {
            projectId,
            leaderboard,
        };
    }

    async getDeveloperRisk(projectId: string, daysThreshold = 7) {
        const now = new Date();

        // Fetch all developer activities for the project
        const activities = await this.prisma.developerActivity.findMany({
            where: { projectId },
            orderBy: { activityTimestamp: 'desc' }, // latest activity first
        });

        if (!activities.length) {
            return { message: 'No developer activity found for this project' };
        }

        // Calculate days since last activity per developer
        const developerLastActivityMap: Record<string, Date> = {};
        activities.forEach((activity) => {
            const login = activity.developerLogin;
            if (!developerLastActivityMap[login] || developerLastActivityMap[login] < activity.activityTimestamp) {
                developerLastActivityMap[login] = activity.activityTimestamp;
            }
        });

        const riskDevelopers = Object.entries(developerLastActivityMap)
            .map(([developer, lastActive]) => {
                const diffMs = now.getTime() - lastActive.getTime();
                const daysSinceLastCommit = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                return {
                    developer,
                    lastActive: lastActive.toISOString(),
                    daysSinceLastCommit,
                    risk: daysSinceLastCommit > daysThreshold ? 'Inactive' : 'Active',
                };
            })
            .sort((a, b) => b.daysSinceLastCommit - a.daysSinceLastCommit); // sort by inactivity

        return { projectId, riskDevelopers };
    }
}
