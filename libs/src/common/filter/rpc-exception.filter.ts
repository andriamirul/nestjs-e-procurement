import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { isNotEmpty } from 'class-validator';
import { Observable, throwError } from 'rxjs';
import { TypeORMError } from 'typeorm';

@Catch()
export class RpcExceptionFilter extends BaseExceptionFilter {
  constructor(applicationRef: HttpServer) {
    super(applicationRef);
  }
  catch(
    exception:
      | any
      | HttpException
      | UnprocessableEntityException
      | TypeORMError,
    host: ArgumentsHost,
  ): Observable<never> | void {
    const hostType = host.getType();
    const message = isNotEmpty(exception.message)
      ? exception.message
      : 'Internal server error';
    const statusCode = isNotEmpty(exception.status)
      ? exception.status
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (hostType === 'rpc') {
      if (statusCode == HttpStatus.UNPROCESSABLE_ENTITY) {
        return throwError(
          () =>
            new UnprocessableEntityException(
              {
                message: 'Invalid Fields',
                errors: exception?.response?.errors,
              },
              statusCode,
            ),
        );
      }

      return throwError(() => new HttpException(message, statusCode));
    }

    if (
      exception instanceof UnprocessableEntityException ||
      statusCode === HttpStatus.UNPROCESSABLE_ENTITY
    ) {
      return super.catch(
        new UnprocessableEntityException(exception?.response || exception),
        host,
      );
    }

    if (exception instanceof TypeORMError) {
      if (exception.message.includes(`RESTRICT`)) {
        let property = `Restrict`;
        let regex = /`\w+`\.`(\w+)`/;
        let match = exception.message.match(regex);
        if (!match) {
          regex = /fails \(`[^`]+`\.`([^`]+)`/;
          match = exception.message.match(regex);
        }

        if (match && match.length > 0) {
          property = match[1];
        }

        return super.catch(
          new UnprocessableEntityException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Invalid Fields',
            errors: [
              {
                property: property,
                concern: `IsRestricted`,
              },
            ],
          }),
          host,
        );
      }
    }

    if (typeof exception === 'object') {
      exception = JSON.stringify(exception);
      if (exception === '{}') exception = message;
    }
    return super.catch(
      new HttpException(
        exception?.response || message || exception,
        statusCode,
      ),
      host,
    );
  }
}
