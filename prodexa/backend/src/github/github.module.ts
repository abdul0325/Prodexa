/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { GithubCommitDetailsService } from './services/github-commit-details.service';

@Module({
  imports: [HttpModule, PrismaModule, RedisModule],
  providers: [GithubService, GithubCommitDetailsService],
  exports: [GithubService,GithubCommitDetailsService],
})
export class GithubModule { }
