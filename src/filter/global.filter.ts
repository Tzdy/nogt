import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { HttpOKException } from 'src/utils/Exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let msg = ``;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 500;
    if (exception instanceof UniqueConstraintError) {
      exception.errors.forEach((item) => {
        msg = msg + item.message + '\n';
      });
    } else if (exception instanceof HttpOKException) {
      msg = exception.message;
      code = exception.code;
      status = exception.getStatus();
    } else if (exception instanceof Error) {
      msg = exception.message;
      console.log(exception);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(status).json({
      code,
      message: msg,
    });
  }
}
