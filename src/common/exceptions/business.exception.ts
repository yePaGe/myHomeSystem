import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    subCode: number,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, sub_code: subCode }, statusCode);
  }
}
