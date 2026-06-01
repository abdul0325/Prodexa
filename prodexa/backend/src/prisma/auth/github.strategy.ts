/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {

    console.log(
      'BACKEND_URL =',
      process.env.BACKEND_URL,
    );

    console.log(
      'CALLBACK_URL =',
      `${process.env.BACKEND_URL}/auth/github/callback`,
    );
    super({
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL:
        `${process.env.BACKEND_URL}/auth/github/callback`,
      scope: [
        'user:email',
        'repo',
        'admin:repo_hook',
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.authService.validateGithubUser(profile, accessToken);
  }
}
