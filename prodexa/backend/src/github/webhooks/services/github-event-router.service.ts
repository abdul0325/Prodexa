/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GithubEventRouterService {
  private readonly logger =
    new Logger(GithubEventRouterService.name);

  route(event: string, payload: any) {
    switch (event) {
      case 'push':
        this.handlePush(payload);
        break;

      case 'pull_request':
        this.handlePullRequest(payload);
        break;

      case 'issues':
        this.handleIssue(payload);
        break;

      default:
        this.logger.warn(
          `Unhandled GitHub event: ${event}`,
        );
    }
  }

  private handlePush(payload: any) {
    this.logger.log(
      `Push event for repo: ${payload.repository?.full_name}`,
    );
  }

  private handlePullRequest(payload: any) {
    this.logger.log(
      `PR event: ${payload.action}`,
    );
  }

  private handleIssue(payload: any) {
    this.logger.log(
      `Issue event: ${payload.action}`,
    );
  }
}