import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next
      .handle()
      .pipe(
        map((data) => ({
          statusCode: context.switchToHttp().getResponse().statusCode,
          data,
        })),
      )
      .pipe(
        catchError((err) => {
          if (err instanceof BadRequestException) {
            return throwError(() => err);
          }
          const response = {
            statusCode: 500,
            message: [err.message || 'Internal server error'],
          };
          return throwError(() => new HttpException(response, 500));
        }),
      );
  }
}
