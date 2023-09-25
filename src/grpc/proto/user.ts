/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "../google/protobuf/struct";

export const protobufPackage = "user";

/** The request message containing the user's name. */
export interface CreateUserRequest {
  name: string;
  email?: string | undefined;
  login: Login | undefined;
}

export interface Login {
  method: string;
  /** optional google.protobuf.Any data = 2; */
  data?: { [key: string]: any } | undefined;
  imageUrl?: string | undefined;
}

export interface FindUserRequest {
  name?: string | undefined;
  email?: string | undefined;
  loginMethod?: string | undefined;
}

export interface LoginUserRequest {
  id: number;
  login: Login | undefined;
}

export interface User {
  id: number;
  name: string;
  email?: string | undefined;
  imageUrl?: string | undefined;
}

export interface UserReply {
  user?: User | undefined;
}

export const USER_PACKAGE_NAME = "user";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<UserReply>;

  findUser(request: FindUserRequest): Observable<UserReply>;

  loginUser(request: LoginUserRequest): Observable<UserReply>;
}

export interface UserServiceController {
  createUser(request: CreateUserRequest): Promise<UserReply> | Observable<UserReply> | UserReply;

  findUser(request: FindUserRequest): Promise<UserReply> | Observable<UserReply> | UserReply;

  loginUser(request: LoginUserRequest): Promise<UserReply> | Observable<UserReply> | UserReply;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createUser", "findUser", "loginUser"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
