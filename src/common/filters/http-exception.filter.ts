import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const i18n = I18nContext.current() || (ctx.getRequest() as any).i18nContext;

    let errorMessage = exception.message;
    let subCode = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const msg = (exceptionResponse as any).message;
      if (Array.isArray(msg)) {
        errorMessage = msg.join('; '); // DTO 校验错误通常是数组
      } else if (typeof msg === 'string') {
        errorMessage = msg;
      }
      // 提取自定义的 sub_code
      if ((exceptionResponse as any).sub_code) {
        subCode = (exceptionResponse as any).sub_code;
      }
    }

    if (i18n) {
      try {
        const translation = i18n.t(errorMessage);
        if (translation) {
          errorMessage = translation as string;
        }
      } catch {
        // ignore
      }
    }

    const responseBody: any = {
      code: status,
      msg: 'request: fail',
      data: errorMessage,
    };

    if (subCode) {
      responseBody.sub_code = subCode;
    }

    response.status(status).json(responseBody);
  }
}
