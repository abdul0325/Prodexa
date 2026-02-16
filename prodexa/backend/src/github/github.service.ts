import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GithubService {
  constructor(private prisma: PrismaService) {}

  async getUserRepos(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.passwordHash) {
      throw new Error('GitHub token not found');
    }

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${user.passwordHash}`,
      },
    });

    return response.data;
  }
}
