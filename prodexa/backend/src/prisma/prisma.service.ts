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
    this.$on('query', (e) => {
      console.log('--- Prisma Query ---');
      console.log('Query:', e.query); // SQL
      console.log('Params:', e.params); // Values
      console.log('Duration:', e.duration + 'ms'); // Execution time
      console.log('--------------------');
    });
  }
}
