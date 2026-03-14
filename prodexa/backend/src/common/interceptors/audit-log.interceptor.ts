import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;

    // Only audit mutating operations (POST, PUT, PATCH, DELETE)
    const shouldAudit = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (!shouldAudit || !user?.userId) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async () => {
        try {
          // Parse action from URL pattern
          const action = this.parseAction(method, url);
          const { targetType, targetId } = this.parseTarget(url, request.params);

          await this.prisma.auditLog.create({
            data: {
              userId: user.userId,
              action,
              targetType,
              targetId: targetId || 'unknown',
              metadata: {
                method,
                url,
                body: this.sanitizeBody(request.body),
              },
            },
          });
        } catch (err) {
          // Never let audit logging crash the request
          this.logger.error('Failed to write audit log', err);
        }
      }),
    );
  }

  private parseAction(method: string, url: string): string {
    const methodMap: Record<string, string> = {
      POST: 'CREATED',
      PUT: 'UPDATED',
      PATCH: 'UPDATED',
      DELETE: 'DELETED',
    };

    const resource = url.split('/')[2]?.toUpperCase() || 'RESOURCE';
    return `${resource}_${methodMap[method] || method}`;
  }

  private parseTarget(url: string, params: any): { targetType: string; targetId: string } {
    const parts = url.split('/').filter(Boolean);
    return {
      targetType: parts[1] || 'unknown',
      targetId: params?.id || params?.userId || 'unknown',
    };
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};
    const sanitized = { ...body };
    // Remove sensitive fields from logs
    delete sanitized.password;
    delete sanitized.passwordHash;
    delete sanitized.githubToken;
    delete sanitized.accessToken;
    return sanitized;
  }
}
