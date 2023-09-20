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

export interface TestingRequest {}

export interface TestingReply {
  message: string;
}

export const USER_PACKAGE_NAME = 'user';

/** The greeting service definition. */

export interface UserServiceClient {
  /** Sends a greeting */

  createUser(request: CreateUserRequest): Observable<UserReply>;

  testing(request: TestingRequest): Observable<TestingReply>;
}

/** The greeting service definition. */

export interface UserServiceController {
  /** Sends a greeting */

  createUser(
    request: CreateUserRequest,
  ): Promise<UserReply> | Observable<UserReply> | UserReply;

  testing(
    request: TestingRequest,
  ): Promise<TestingReply> | Observable<TestingReply> | TestingReply;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createUser', 'testing'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserService', method)(
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
      GrpcStreamMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';