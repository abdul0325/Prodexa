import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { GitHubCommit, GitHubPull, GitHubIssue } from './github.types';

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  // -------------------------------
  // CORE REQUEST HANDLER
  // -------------------------------

  private async fetchPaginated<T>(
    url: string,
    token: string,
    params: any = {},
  ): Promise<T[]> {
    const results: T[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const response = await this.httpService.axiosRef.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...params, per_page: perPage, page },
        });

        results.push(...response.data);

        if (response.data.length < perPage) break;
        page++;
      }

      return results;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 403) {
        throw new HttpException(
          'GitHub API rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new HttpException(
        'GitHub API request failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // -------------------------------
  // PUBLIC METHODS
  // -------------------------------

  async getContributors(owner: string, repo: string, token: string) {
    return this.fetchPaginated<{ login: string }>(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      token,
    );
  }

  async getCommitsFromProject(
    owner: string,
    repo: string,
    token: string,
    since: string,
  ) {
    return this.fetchPaginated<GitHubCommit>(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      token,
      { since },
    );
  }

  async getPullRequestsFromProject(
    owner: string,
    repo: string,
    token: string,
  ) {
    return this.fetchPaginated<GitHubPull>(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      token,
      { state: 'all' },
    );
  }

  async getIssuesFromProject(
    owner: string,
    repo: string,
    token: string,
  ) {
    return this.fetchPaginated<GitHubIssue>(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      token,
      { state: 'all' },
    );
  }

  async getUserRepos(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.passwordHash) throw new Error('GitHub token not found');

        const response = await this.httpService.axiosRef.get('https://api.github.com/user/repos', {
            headers: { Authorization: `token ${user.passwordHash}` },
        });

        return response.data;
    }
}
