import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorMessage = exception.message;
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const msg = (exceptionResponse as any).message;
      if (Array.isArray(msg)) {
        errorMessage = msg.join('; '); // DTO 校验错误通常是数组
      } else if (typeof msg === 'string') {
        errorMessage = msg;
      }
    }

    response.status(status).json({
      code: status,
      msg: 'request: fail',
      data: errorMessage,
    });
  }
}
