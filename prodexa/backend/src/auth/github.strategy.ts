/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:3001/auth/github/callback',
            scope: ['user:email'],
        });

    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        return this.authService.validateGithubUser(profile, accessToken);
    }
}
