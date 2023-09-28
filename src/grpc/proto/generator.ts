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

export interface ScribblePredictRequest {
  imageUrl: string;
  prompt?: string | undefined;
}

export interface ScribblePredictReply {
  url: string;
}

export interface CaptionPredictRequest {
  imageUrl: string;
}

export interface CaptionPredictReply {
  caption: string;
}

export const GENERATOR_PACKAGE_NAME = "generator";

export interface GeneratorServiceClient {
  predict(request: PredictRequest): Observable<PredictReply>;

  scribblePredict(request: ScribblePredictRequest): Observable<ScribblePredictReply>;

  captionPredict(request: CaptionPredictRequest): Observable<CaptionPredictReply>;
}

export interface GeneratorServiceController {
  predict(request: PredictRequest): Promise<PredictReply> | Observable<PredictReply> | PredictReply;

  scribblePredict(
    request: ScribblePredictRequest,
  ): Promise<ScribblePredictReply> | Observable<ScribblePredictReply> | ScribblePredictReply;

  captionPredict(
    request: CaptionPredictRequest,
  ): Promise<CaptionPredictReply> | Observable<CaptionPredictReply> | CaptionPredictReply;
}

export function GeneratorServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["predict", "scribblePredict", "captionPredict"];
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
