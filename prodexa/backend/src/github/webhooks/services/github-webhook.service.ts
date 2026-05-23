/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { GITHUB_EVENTS_QUEUE } from '../queues/github-events.queue';

@Injectable()
export class GithubWebhookService {
  constructor(
    @InjectQueue(GITHUB_EVENTS_QUEUE)
    private readonly githubQueue: Queue,
  ) { }

  async publishEvent(
    event: string,
    payload: any,
  ) {
    console.log(
      'ADDING JOB TO QUEUE',
    );
    await this.githubQueue.add(
      event,
      {
        event,
        payload,
      },
      {
        attempts: 5,

        backoff: {
          type: 'exponential',
          delay: 3000,
        },

        removeOnComplete: 100,

        removeOnFail: 500,
      },
    );
    console.log(
      'JOB ADDED',
    );
  }
}