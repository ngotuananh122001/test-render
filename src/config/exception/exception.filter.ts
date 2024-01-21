import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as ExceptionFilterBase,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { getLogger } from '../../shared/logger';
const logger = getLogger('Exceptionfilter');

@Catch()
export class ExceptionFilter<T> implements ExceptionFilterBase {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // log data
    logger.error(`Body: ${JSON.stringify(request.body)}`);
    logger.error(`Query: ${JSON.stringify(request.query)}`);
    logger.error(`Params: ${JSON.stringify(request.params)}`);
    logger.error(exception);

    console.log('export class ExceptionFilter<T> implements ExceptionFilterBase ', exception);

    response.status(status).json({
      meta: exception instanceof HttpException ? exception.getResponse() : {
        statusCode: status,
        message: "Internal server error",
      },
      data: new Object(),
    });
  }
}
