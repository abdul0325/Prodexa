/* eslint-disable prettier/prettier */
import { Injectable }
from '@nestjs/common';

@Injectable()
export class FileClassificationService {

    classify(
        filename: string,
    ) {

        const lower =
            filename.toLowerCase();

        const extension =
            lower.split('.').pop();

        return {

            extension,

            isTestFile:

                lower.includes(
                    '.test.',
                ) ||

                lower.includes(
                    '.spec.',
                ) ||

                lower.includes(
                    '__tests__',
                ),

            isDocumentation:

                lower.endsWith(
                    '.md',
                ) ||

                lower.includes(
                    'docs/',
                ),

            isConfigFile:

                lower.includes(
                    'config',
                ) ||

                lower.endsWith(
                    '.json',
                ) ||

                lower.endsWith(
                    '.yml',
                ) ||

                lower.endsWith(
                    '.yaml',
                ) ||

                lower.endsWith(
                    '.env',
                ),
        };
    }
}