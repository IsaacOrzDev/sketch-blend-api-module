/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'user';

/** The request message containing the user's name. */
export interface CreateUserRequest {
  name: string;
  email?: string | undefined;
}

/** The response message containing the greetings. */
export interface UserReply {
  id: number;
  name: string;
  email: string;
}

export const USER_PACKAGE_NAME = 'user';

/** The greeting service definition. */

export interface UserClient {
  /** Sends a greeting */

  createUser(request: CreateUserRequest): Observable<UserReply>;
}

/** The greeting service definition. */

export interface UserController {
  /** Sends a greeting */

  createUser(
    request: CreateUserRequest,
  ): Promise<UserReply> | Observable<UserReply> | UserReply;
}

export function UserControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createUser'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('User', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('User', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'User';
