import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorMessageKey, getErrorMessage } from '../error-messages';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const key = exception.message;

    const errorMessage = getErrorMessage(key as ErrorMessageKey);

    if (errorMessage) {
      return response.status(status).json({
        key,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    return response.status(500).json({
      message: key,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
