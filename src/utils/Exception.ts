import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpOKException extends HttpException {
  code: number;

  constructor(message: string, code = 20001) {
    super(message, HttpStatus.OK);
    this.code = code;
  }
}
