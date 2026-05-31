/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommitService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async storeCommits(
        normalizedEvent: any,
    ) {

        for (const commit of normalizedEvent.commits) {

            await this.prisma.commitEvent.upsert({

                where: {
                    sha: commit.sha,
                },

                update: {},

                create: {

                    sha: commit.sha,

                    repositoryId:
                        normalizedEvent.repository.id.toString(),

                    repositoryName:
                        normalizedEvent.repository.fullName,

                    authorLogin:
                        normalizedEvent.author.login,

                    message:
                        commit.message,

                    branch:
                        normalizedEvent.branch,

                    commitUrl:
                        commit.url,

                    committedAt:
                        new Date(commit.timestamp),
                },
            });
        }
    }

    async commitExists(sha: string) {
        const commit =
            await this.prisma.commitEvent.findUnique({
                where: { sha },
                select: { sha: true },
            });

        return !!commit;
    }

    async getLatestCommit(projectId: string) {
        return this.prisma.commitEvent.findFirst({
            where: {
                repositoryId: projectId,
            },
            orderBy: {
                committedAt: 'desc',
            },
        });
    }
}