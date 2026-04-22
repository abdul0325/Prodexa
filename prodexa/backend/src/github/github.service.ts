import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { GitHubCommit, GitHubPull, GitHubIssue } from './github.types';

const CACHE_TTL = 30 * 60; // 30 minutes in seconds

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    @InjectRedis() private redis: Redis,
  ) {}

  // ─────────────────────────────────────────────
  // CORE: Paginated fetcher with retry + rate limit
  // ─────────────────────────────────────────────

  private async fetchPaginated<T>(
    url: string,
    token: string,
    params: any = {},
    retries = 3,
  ): Promise<T[]> {
    const results: T[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      let lastError: any;

      // Retry loop
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await this.httpService.axiosRef.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            params: { ...params, per_page: perPage, page },
          });

          // Check remaining rate limit
          const remaining = parseInt(response.headers['x-ratelimit-remaining'] || '100');
          if (remaining < 10) {
            this.logger.warn(`GitHub rate limit low: ${remaining} requests remaining`);
          }

          results.push(...response.data);

          if (response.data.length < perPage) return results;
          page++;
          lastError = null;
          break; // success — exit retry loop

        } catch (error: any) {
          lastError = error;

          if (error.response?.status === 403) {
            const resetTime = error.response.headers['x-ratelimit-reset'];
            const waitMs = resetTime
              ? (parseInt(resetTime) * 1000 - Date.now()) + 1000
              : Math.pow(2, attempt) * 1000; // exponential backoff

            this.logger.warn(`Rate limited. Waiting ${Math.round(waitMs / 1000)}s before retry ${attempt}/${retries}`);
            await this.sleep(waitMs);
            continue;
          }

          if (error.response?.status === 404) {
            throw new HttpException('Repository not found or is private', HttpStatus.NOT_FOUND);
          }

          // Exponential backoff for other errors
          if (attempt < retries) {
            await this.sleep(Math.pow(2, attempt) * 500);
          }
        }
      }

      if (lastError) {
        throw new HttpException(
          `GitHub API request failed after ${retries} retries: ${lastError.message}`,
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
  }

  // ─────────────────────────────────────────────
  // CACHE HELPERS
  // ─────────────────────────────────────────────

  private getCacheKey(type: string, owner: string, repo: string): string {
    return `github:${type}:${owner}:${repo}`;
  }

  private async getFromCache<T>(key: string): Promise<T[] | null> {
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        this.logger.log(`Cache HIT: ${key}`);
        return JSON.parse(cached);
      }
    } catch (e) {
      this.logger.warn(`Cache read error: ${e}`);
    }
    return null;
  }

  private async setCache(key: string, data: any): Promise<void> {
    try {
      await this.redis.setex(key, CACHE_TTL, JSON.stringify(data));
      this.logger.log(`Cache SET: ${key} (TTL: ${CACHE_TTL}s)`);
    } catch (e) {
      this.logger.warn(`Cache write error: ${e}`);
    }
  }

  async invalidateCache(owner: string, repo: string): Promise<void> {
    const keys = [
      this.getCacheKey('commits', owner, repo),
      this.getCacheKey('pulls', owner, repo),
      this.getCacheKey('issues', owner, repo),
      this.getCacheKey('contributors', owner, repo),
    ];
    await Promise.all(keys.map(k => this.redis.del(k)));
    this.logger.log(`Cache invalidated for ${owner}/${repo}`);
  }

  // ─────────────────────────────────────────────
  // PUBLIC METHODS (with caching)
  // ─────────────────────────────────────────────

  async getContributors(owner: string, repo: string) {
    const cacheKey = this.getCacheKey('contributors', owner, repo);
    const cached = await this.getFromCache<any>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.httpService.axiosRef.get(
        `https://api.github.com/repos/${owner}/${repo}/contributors`,
        { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } },
      );
      await this.setCache(cacheKey, response.data);
      this.logger.log(`Fetched ${response.data.length} contributors for ${owner}/${repo}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch contributors', HttpStatus.BAD_GATEWAY);
    }
  }

  async getAllCommits(owner: string, repo: string) {
    const cacheKey = this.getCacheKey('commits', owner, repo);
    const cached = await this.getFromCache<GitHubCommit>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchPaginated<GitHubCommit>(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      process.env.GITHUB_TOKEN || '',
      { per_page: 100 },
    );

    this.logger.log(`Fetched ${data.length} commits for ${owner}/${repo}`);
    await this.setCache(cacheKey, data);
    return data;
  }

  async getAllPullRequests(owner: string, repo: string) {
    const cacheKey = this.getCacheKey('pulls', owner, repo);
    const cached = await this.getFromCache<GitHubPull>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchPaginated<GitHubPull>(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      process.env.GITHUB_TOKEN || '',
      { state: 'all' },
    );

    this.logger.log(`Fetched ${data.length} PRs for ${owner}/${repo}`);
    await this.setCache(cacheKey, data);
    return data;
  }

  async getAllIssues(owner: string, repo: string) {
    const cacheKey = this.getCacheKey('issues', owner, repo);
    const cached = await this.getFromCache<GitHubIssue>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchPaginated<GitHubIssue>(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      process.env.GITHUB_TOKEN || '',
      { state: 'all' },
    );

    // Filter out PRs that appear as issues
    const realIssues = data.filter((i: any) => !i.pull_request);
    this.logger.log(`Fetched ${realIssues.length} issues for ${owner}/${repo}`);
    await this.setCache(cacheKey, realIssues);
    return realIssues;
  }

  async getCommitsFromProject(owner: string, repo: string, token: string, since: string) {
    return this.fetchPaginated<GitHubCommit>(
      `https://api.github.com/repos/${owner}/${repo}/commits`,
      token,
      { since },
    );
  }

  async getPullRequestsFromProject(owner: string, repo: string, token: string) {
    return this.fetchPaginated<GitHubPull>(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      token,
      { state: 'all' },
    );
  }

  async getIssuesFromProject(owner: string, repo: string, token: string) {
    return this.fetchPaginated<GitHubIssue>(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      token,
      { state: 'all' },
    );
  }

  async getUserRepos(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.githubToken) throw new HttpException('GitHub token not found', HttpStatus.UNAUTHORIZED);

    const response = await this.httpService.axiosRef.get(
      'https://api.github.com/user/repos',
      {
        headers: { Authorization: `token ${user.githubToken}` },
        params: { per_page: 100, sort: 'updated' },
      },
    );

    return response.data;
  }

  // Check GitHub API rate limit status
  async getRateLimit(token: string) {
    const response = await this.httpService.axiosRef.get(
      'https://api.github.com/rate_limit',
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data.rate;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
