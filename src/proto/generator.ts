/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "generator";

export interface PredictRequest {
  prompt: string;
}

export interface PredictReply {
  urls: string[];
}

export const GENERATOR_PACKAGE_NAME = "generator";

export interface GeneratorServiceClient {
  predict(request: PredictRequest): Observable<PredictReply>;
}

export interface GeneratorServiceController {
  predict(request: PredictRequest): Promise<PredictReply> | Observable<PredictReply> | PredictReply;
}

export function GeneratorServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["predict"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("GeneratorService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("GeneratorService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const GENERATOR_SERVICE_NAME = "GeneratorService";
