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

export interface ScribblePredictInBackgroundReply {
  id: string;
}

export interface ScribblePredictStatusReply {
  status: string;
  url?: string | undefined;
}

export interface CaptionPredictRequest {
  imageUrl: string;
}

export interface CaptionPredictReply {
  caption: string;
}

export const GENERATOR_PACKAGE_NAME = "generator";

export interface GeneratorServiceClient {
  scribblePredict(request: ScribblePredictRequest): Observable<ScribblePredictReply>;

  scribblePredictInBackground(request: ScribblePredictRequest): Observable<ScribblePredictInBackgroundReply>;

  scribblePredictStatus(request: ScribblePredictInBackgroundReply): Observable<ScribblePredictStatusReply>;

  captionPredict(request: CaptionPredictRequest): Observable<CaptionPredictReply>;
}

export interface GeneratorServiceController {
  scribblePredict(
    request: ScribblePredictRequest,
  ): Promise<ScribblePredictReply> | Observable<ScribblePredictReply> | ScribblePredictReply;

  scribblePredictInBackground(
    request: ScribblePredictRequest,
  ):
    | Promise<ScribblePredictInBackgroundReply>
    | Observable<ScribblePredictInBackgroundReply>
    | ScribblePredictInBackgroundReply;

  scribblePredictStatus(
    request: ScribblePredictInBackgroundReply,
  ): Promise<ScribblePredictStatusReply> | Observable<ScribblePredictStatusReply> | ScribblePredictStatusReply;

  captionPredict(
    request: CaptionPredictRequest,
  ): Promise<CaptionPredictReply> | Observable<CaptionPredictReply> | CaptionPredictReply;
}

export function GeneratorServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "scribblePredict",
      "scribblePredictInBackground",
      "scribblePredictStatus",
      "captionPredict",
    ];
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
