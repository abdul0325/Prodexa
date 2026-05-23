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

        const response =
            await axios.get(

                `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,

                {
                    headers: {

                        Authorization:
                            `Bearer ${process.env.GITHUB_TOKEN}`,

                        Accept:
                            'application/vnd.github+json',
                    },
                },
            );

        return response.data;
    }
}