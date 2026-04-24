import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubService } from './github.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    RedisModule,
  ],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}