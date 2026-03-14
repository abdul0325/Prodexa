import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.userId) {
      throw new UnauthorizedException('Authentication required');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true, isActive: true },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    if (dbUser.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied: Admin role required');
    }

    return true;
  }
}
