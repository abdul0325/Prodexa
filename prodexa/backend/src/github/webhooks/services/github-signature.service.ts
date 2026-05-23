/* eslint-disable prettier/prettier */
import * as crypto from 'crypto';
import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GithubSignatureService {
    validateSignature(
        payload: string,
        signature: string,
    ): boolean {
        const secret =
            process.env.GITHUB_WEBHOOK_SECRET;

        if (!secret) {
            throw new Error(
                'GITHUB_WEBHOOK_SECRET is not defined',
            );
        }

        const hash =
            'sha256=' +
            crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(hash),
            Buffer.from(signature),
        );
    }

    verify(
        payload: string,
        signature?: string,
    ) {
        if (!signature) {
            throw new UnauthorizedException(
                'Missing GitHub signature',
            );
        }

        const isValid = this.validateSignature(
            payload,
            signature,
        );

        if (!isValid) {
            throw new UnauthorizedException(
                'Invalid GitHub signature',
            );
        }
    }
}