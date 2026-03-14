import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
      error = exception.name;
    } else if (exception instanceof Error) {
      // Map known error messages to proper HTTP codes
      if (exception.message.includes('not found') || exception.message.includes('Not found')) {
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        error = 'NotFound';
      } else if (exception.message.includes('Unauthorized') || exception.message.includes('token')) {
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message;
        error = 'Unauthorized';
      } else if (exception.message.includes('GitHub API rate limit')) {
        status = HttpStatus.TOO_MANY_REQUESTS;
        message = 'GitHub API rate limit exceeded. Please try again later.';
        error = 'RateLimitExceeded';
      } else {
        message = exception.message;
      }
    }

    // Log server errors
    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} → ${status}: ${message}`, (exception as any)?.stack);
    } else {
      this.logger.warn(`${request.method} ${request.url} → ${status}: ${message}`);
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
