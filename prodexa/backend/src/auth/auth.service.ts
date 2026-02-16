/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateGithubUser(profile: any, accessToken: string) {
    const email = profile.emails?.[0]?.value;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
  user = await this.prisma.user.create({
    data: {
      name: profile.displayName || profile.username,
      email,
      passwordHash: accessToken, // temporary storage
    },
  });
} else {
  user = await this.prisma.user.update({
    where: { email },
    data: {
      passwordHash: accessToken, // update token
    },
  });
}


    const payload = { sub: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
