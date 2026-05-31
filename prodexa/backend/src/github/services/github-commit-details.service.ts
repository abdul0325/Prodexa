/* eslint-disable prettier/prettier */
import { Injectable }
    from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class GithubCommitDetailsService {

    async fetchCommitDetails(
        owner: string,
        repo: string,
        sha: string,
    ) {

        console.log(
            'FETCHING COMMIT DETAILS:',
            sha,
        );

        const response =
            await axios.get(
                `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
                {
                    timeout: 15000,
                    headers: {
                        Authorization:
                            `Bearer ${process.env.GITHUB_TOKEN}`,
                        Accept:
                            'application/vnd.github+json',
                    },
                },
            );

        console.log(
            'FILES:',
            response.data.files?.length,
        );

        return response.data;
    }
}