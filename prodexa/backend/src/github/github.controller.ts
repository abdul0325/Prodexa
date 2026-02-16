import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @UseGuards(JwtAuthGuard)
  @Get('repos')
  async getRepos(@Req() req) {
    return this.githubService.getUserRepos(req.user.userId);
  }
}
