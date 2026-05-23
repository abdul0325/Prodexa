/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { GithubWebhookController } from 'src/github/webhooks/controllers/github-webhook.controller';
import { GithubWebhookService } from 'src/github/webhooks/services/github-webhook.service';
import { GithubEventRouterService } from 'src/github/webhooks/services/github-event-router.service';
import { GithubSignatureService } from 'src/github/webhooks/services/github-signature.service';
import { GithubEventsWorker } from 'src/github/webhooks/workers/github-events.worker';
import { GithubEventNormalizerService } from 'src/github/webhooks/services/github-event-normalizer.service';
import { AnalyticsQueueModule } from 'src/analytics/analytics.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GithubModule } from '../github.module';
import { GITHUB_EVENTS_QUEUE } from './queues/github-events.queue';
import { IntelligenceModule } from 'src/intelligence/intelligence.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: GITHUB_EVENTS_QUEUE,
        }),
        AnalyticsQueueModule,
        GatewayModule,
        PrismaModule,
        GithubModule,
        IntelligenceModule
    ],

    controllers: [GithubWebhookController],

    providers: [
        GithubWebhookService,
        GithubEventRouterService,
        GithubSignatureService,
        GithubEventsWorker,
        GithubEventNormalizerService,
    ],
})
export class GithubWebhooksModule { }