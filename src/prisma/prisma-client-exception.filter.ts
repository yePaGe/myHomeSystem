import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log(exception.code); // 打印日志以便调试
    console.error(exception.message); // 打印日志以便调试

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const target =
          (exception.meta?.target as string[])?.join(', ') || '字段';
        response.status(status).json({
          code: status,
          msg: 'request: fail',
          data: `数据冲突：${target} 已存在，请检查是否重复录入。`,
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          code: status,
          msg: 'request: fail',
          data: `记录未找到：请求的操作对象不存在。`,
        });
        break;
      }
      default:
        // 其他 Prisma 错误交由父类处理（通常是 500）
        super.catch(exception, host);
        break;
    }
  }
}
