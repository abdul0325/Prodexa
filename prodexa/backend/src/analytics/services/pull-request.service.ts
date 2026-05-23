import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PullRequestService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async storePullRequest(
        normalizedEvent: any,
    ) {

        const pr =
            normalizedEvent.pullRequest;

        await this.prisma.pullRequestEvent.upsert({

            where: {
                githubPrId:
                    pr.githubPrId,
            },

            update: {

                state: pr.state,

                action:
                    normalizedEvent.action,

                mergedAtGithub:
                    pr.mergedAt
                        ? new Date(pr.mergedAt)
                        : null,

                closedAtGithub:
                    pr.closedAt
                        ? new Date(pr.closedAt)
                        : null,
            },

            create: {

                githubPrId:
                    pr.githubPrId,

                repositoryId:
                    normalizedEvent.repository.id.toString(),

                repositoryName:
                    normalizedEvent.repository.fullName,

                authorLogin:
                    normalizedEvent.author.login,

                title:
                    pr.title,

                state:
                    pr.state,

                action:
                    normalizedEvent.action,

                branch:
                    pr.branch,

                baseBranch:
                    pr.baseBranch,

                isDraft:
                    pr.isDraft,

                additions:
                    pr.additions,

                deletions:
                    pr.deletions,

                changedFiles:
                    pr.changedFiles,

                commitsCount:
                    pr.commitsCount,

                createdAtGithub:
                    new Date(pr.createdAt),

                mergedAtGithub:
                    pr.mergedAt
                        ? new Date(pr.mergedAt)
                        : null,

                closedAtGithub:
                    pr.closedAt
                        ? new Date(pr.closedAt)
                        : null,
            },
        });
    }
}