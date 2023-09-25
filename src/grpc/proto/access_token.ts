/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../google/protobuf/timestamp";

export const protobufPackage = "access_token";

export interface GenerateAccessTokenRequest {
  userId?: number | undefined;
  username?: string | undefined;
  email?: string | undefined;
  imageUrl?: string | undefined;
  durationType?: string | undefined;
}

export interface AccessTokenReply {
  accessToken: string;
  expiresAtUtc: Timestamp | undefined;
}

export interface VerifyAccessTokenRequest {
  accessToken: string;
}

export interface VerifyAccessTokenReply {
  isValid: boolean;
  userId?: number | undefined;
  username?: string | undefined;
  email?: string | undefined;
  imageUrl?: string | undefined;
}

export interface AddOneTimeAccessTokenRequest {
  userId?: number | undefined;
  username?: string | undefined;
  email?: string | undefined;
  imageUrl?: string | undefined;
  durationType?: string | undefined;
}

export interface AddOneTimeAccessTokenReply {
  accessToken: string;
  expiresAtUtc: Timestamp | undefined;
}

export interface VerifyOneTimeAccessTokenRequest {
  accessToken: string;
}

export interface VerifyOneTimeAccessTokenReply {
  isValid: boolean;
  userId?: number | undefined;
  username?: string | undefined;
  email?: string | undefined;
  imageUrl?: string | undefined;
}

export const ACCESS_TOKEN_PACKAGE_NAME = "access_token";

export interface AccessTokenServiceClient {
  generateAccessToken(request: GenerateAccessTokenRequest): Observable<AccessTokenReply>;

  verifyAccessToken(request: VerifyAccessTokenRequest): Observable<VerifyAccessTokenReply>;

  addOneTimeAccessToken(request: AddOneTimeAccessTokenRequest): Observable<AddOneTimeAccessTokenReply>;

  verifyOneTimeAccessToken(request: VerifyOneTimeAccessTokenRequest): Observable<VerifyOneTimeAccessTokenReply>;
}

export interface AccessTokenServiceController {
  generateAccessToken(
    request: GenerateAccessTokenRequest,
  ): Promise<AccessTokenReply> | Observable<AccessTokenReply> | AccessTokenReply;

  verifyAccessToken(
    request: VerifyAccessTokenRequest,
  ): Promise<VerifyAccessTokenReply> | Observable<VerifyAccessTokenReply> | VerifyAccessTokenReply;

  addOneTimeAccessToken(
    request: AddOneTimeAccessTokenRequest,
  ): Promise<AddOneTimeAccessTokenReply> | Observable<AddOneTimeAccessTokenReply> | AddOneTimeAccessTokenReply;

  verifyOneTimeAccessToken(
    request: VerifyOneTimeAccessTokenRequest,
  ): Promise<VerifyOneTimeAccessTokenReply> | Observable<VerifyOneTimeAccessTokenReply> | VerifyOneTimeAccessTokenReply;
}

export function AccessTokenServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "generateAccessToken",
      "verifyAccessToken",
      "addOneTimeAccessToken",
      "verifyOneTimeAccessToken",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AccessTokenService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AccessTokenService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ACCESS_TOKEN_SERVICE_NAME = "AccessTokenService";
