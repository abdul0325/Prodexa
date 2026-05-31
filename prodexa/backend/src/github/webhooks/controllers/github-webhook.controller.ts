/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Headers,
    Post,
    Req,
} from '@nestjs/common';

import type { Request } from 'express';

import { GithubWebhookService } from '../services/github-webhook.service';
import { GithubSignatureService } from '../services/github-signature.service';

@Controller('webhooks/github')
export class GithubWebhookController {
    constructor(
        private readonly githubWebhookService: GithubWebhookService,
        private readonly githubSignatureService: GithubSignatureService,
    ) { }

    @Post()
    async handleWebhook(
        @Req() req: Request,

        @Headers('x-github-event')
        githubEvent: string,

        @Headers('x-hub-signature-256')
        signature: string,

        @Body() body: any,
    ) {
        console.log(
            'GITHUB WEBHOOK RECEIVED:',
            githubEvent,
        );
        const rawBody = JSON.stringify(body);

        this.githubSignatureService.verify(
            rawBody,
            signature,
        );

        console.log('WEBHOOK EVENT PUBLISHED TO QUEUE');

        await this.githubWebhookService.publishEvent(
            githubEvent,
            body,
        );

        return {
            success: true,
            queued: true,
            event: githubEvent,
        };
    }
}