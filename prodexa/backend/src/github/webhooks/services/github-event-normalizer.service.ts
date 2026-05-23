/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GithubEventNormalizerService {
  constructor(private readonly prisma: PrismaService) {}

  async normalizePushEvent(payload: any) {
    const repositoryId = payload.repository.id.toString();
    const fullName = payload.repository.full_name;

    // Lookup repository by githubId
    const repository = await this.prisma.repository.findUnique({
      where: { githubId: repositoryId },
    });

    if (!repository) {
      // Create repository if it doesn't exist
      const [owner, repoName] = fullName.split('/');
      await this.prisma.repository.create({
        data: {
          githubId: repositoryId,
          owner,
          repoName,
          fullName,
          url: payload.repository.html_url,
        },
      });
    }

    // Find project by repository
    const repo = await this.prisma.repository.findUnique({
      where: { githubId: repositoryId },
      include: { projects: true },
    });

    const projectId = repo?.projects[0]?.id;

    return {
      type: 'PUSH',

      repositoryId,
      fullName,
      projectId,

      repository: {
        id: payload.repository.id,
        name: payload.repository.name,
        fullName:
          payload.repository.full_name,
      },

      author: {
        login: payload.pusher.name,
      },

      branch:
        payload.ref?.replace(
          'refs/heads/',
          '',
        ),

      commits: payload.commits.map(
        (commit: any) => ({
          sha: commit.id,
          message: commit.message,
          timestamp: commit.timestamp,
          url: commit.url,
        }),
      ),

      pushedAt: payload.head_commit?.timestamp,
    };
  }

  async normalizePullRequestEvent(payload: any) {

    const pr = payload.pull_request;
    const repositoryId = payload.repository.id.toString();
    const fullName = payload.repository.full_name;

    // Lookup repository by githubId
    const repository = await this.prisma.repository.findUnique({
      where: { githubId: repositoryId },
    });

    if (!repository) {
      // Create repository if it doesn't exist
      const [owner, repoName] = fullName.split('/');
      await this.prisma.repository.create({
        data: {
          githubId: repositoryId,
          owner,
          repoName,
          fullName,
          url: payload.repository.html_url,
        },
      });
    }

    // Find project by repository
    const repo = await this.prisma.repository.findUnique({
      where: { githubId: repositoryId },
      include: { projects: true },
    });

    const projectId = repo?.projects[0]?.id;

    return {

      type: 'PULL_REQUEST',

      action: payload.action,

      repositoryId,
      fullName,
      projectId,

      repository: {
        id: payload.repository.id,
        name: payload.repository.name,
        fullName:
          payload.repository.full_name,
      },

      author: {
        login: pr.user.login,
      },

      pullRequest: {

        githubPrId: pr.id,

        title: pr.title,

        state: pr.state,

        isDraft: pr.draft,

        additions: pr.additions,

        deletions: pr.deletions,

        changedFiles: pr.changed_files,

        commitsCount: pr.commits,

        branch: pr.head.ref,

        baseBranch: pr.base.ref,

        createdAt: pr.created_at,

        mergedAt: pr.merged_at,

        closedAt: pr.closed_at,
      },
    };
  }
}