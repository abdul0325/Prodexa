import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { GitHubCommit, GitHubPull, GitHubIssue } from '../github/github.types';
import { randomUUID } from 'crypto';

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

    async analyzeProjectContributors(projectId: string, owner: string, repo: string) {
        const contributors = await this.githubService.getContributors(owner, repo);

        for (const contributor of contributors) {

            const commits = await this.githubService.getCommitCount(owner, repo, contributor.login);

            const prs = await this.githubService.getPullRequestCount(owner, repo, contributor.login);

            const issues = await this.githubService.getIssueCount(owner, repo, contributor.login);

            const productivityScore =
                commits * 2 +
                prs * 5 +
                issues * 3;

            await this.prisma.developerActivity.update({
                where: {
                    developerLogin_projectId: {
                        developerLogin: contributor.login,
                        projectId,
                    },
                },
                data: {
                    commits,
                    pullRequestCount: prs,
                    issueCount: issues,
                    productivityScore,
                },
            });
        }

        return {
            message: "Contributors detected and saved",
            count: contributors.length
        };
    }
}
