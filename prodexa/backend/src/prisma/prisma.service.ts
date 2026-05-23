/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' }, // SQL queries
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'info' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // 👇 Listen to query events
    if (
      process.env.PRISMA_DEBUG === 'true'
    ) {

      this.$on('query', (e) => {

        if (e.duration > 200) {

          console.log(
            '🐢 Slow Query:',
          );

          console.log(
            'Duration:',
            e.duration + 'ms',
          );

          console.log(
            'Query:',
            e.query,
          );

          console.log(
            '--------------------',
          );
        }
      });
    }
  }
}
