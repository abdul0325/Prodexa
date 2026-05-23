import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface UserPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

export const User = createParamDecorator(
  (data: keyof UserPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    return data ? user[data] : user;
  },
);
