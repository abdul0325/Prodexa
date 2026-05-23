/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubEventNormalizerService {
  normalizePushEvent(payload: any) {
    return {
      type: 'PUSH',

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

  normalizePullRequestEvent(payload: any) {

    const pr = payload.pull_request;

    return {

      type: 'PULL_REQUEST',

      action: payload.action,

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