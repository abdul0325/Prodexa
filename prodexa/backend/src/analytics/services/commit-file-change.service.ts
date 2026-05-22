/* eslint-disable prettier/prettier */
import { Injectable }
    from '@nestjs/common';

import { PrismaService }
    from 'src/prisma/prisma.service';

import { FileClassificationService }
    from 'src/intelligence/code-analysis/file-classification.service';

@Injectable()
export class CommitFileChangeService {

    constructor(
        private readonly prisma:
            PrismaService,

        private readonly classifier:
            FileClassificationService,
    ) { }

    async storeCommitFiles(
        commitSha: string,
        files: any[],
    ) {

        for (const file of files) {

            const classification =
                this.classifier.classify(
                    file.filename,
                );

            await this.prisma
                .commitFileChange
                .create({

                    data: {

                        commitSha,

                        filename:
                            file.filename,

                        status:
                            file.status,

                        additions:
                            file.additions || 0,

                        deletions:
                            file.deletions || 0,

                        changes:
                            file.changes || 0,

                        patch:
                            file.patch,

                        fileExtension:
                            classification.extension,

                        isTestFile:
                            classification.isTestFile,

                        isDocumentation:
                            classification.isDocumentation,

                        isConfigFile:
                            classification.isConfigFile,
                    },
                });
            console.log(
                'Commit file change stored:',
                file.filename,
            );
        }
    }
}