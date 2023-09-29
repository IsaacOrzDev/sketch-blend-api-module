/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "../google/protobuf/struct";
import { Timestamp } from "../google/protobuf/timestamp";

export const protobufPackage = "document";

export interface SaveDocumentRequest {
  data: SaveDocumentData | undefined;
  userId: number;
}

export interface SaveDocumentReply {
  id: string;
}

export interface GetDocumentListRequest {
  userId?: number | undefined;
  offset?: number | undefined;
  limit?: number | undefined;
}

export interface GetDocumentListReply {
  records: Document[];
}

export interface GetDocumentRequest {
  id: string;
}

export interface GetDocumentReply {
  record?: DocumentDetail | undefined;
}

export interface UpdateDocumentRequest {
  id: string;
  data: SaveDocumentData | undefined;
}

export interface UpdateDocumentReply {
  id: string;
}

export interface DeleteDocumentRequest {
  id: string;
}

export interface DeleteDocumentReply {
  id: string;
}

export interface SaveDocumentData {
  title: string;
  description?: string | undefined;
  svg?: string | undefined;
  image?: string | undefined;
  paths?: { [key: string]: any } | undefined;
}

export interface Document {
  id: string;
  userId: number;
  title: string;
  description?: string | undefined;
  svg?: string | undefined;
  image?: string | undefined;
  createdAt: Timestamp | undefined;
  updatedAt: Timestamp | undefined;
}

export interface DocumentDetail {
  id: string;
  userId: number;
  title: string;
  description?: string | undefined;
  svg?: string | undefined;
  image?: string | undefined;
  paths?: { [key: string]: any } | undefined;
  createdAt: Timestamp | undefined;
  updatedAt: Timestamp | undefined;
}

export const DOCUMENT_PACKAGE_NAME = "document";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface DocumentServiceClient {
  saveDocument(request: SaveDocumentRequest): Observable<SaveDocumentReply>;

  getDocumentList(request: GetDocumentListRequest): Observable<GetDocumentListReply>;

  getDocument(request: GetDocumentRequest): Observable<GetDocumentReply>;

  updateDocument(request: UpdateDocumentRequest): Observable<UpdateDocumentReply>;

  deleteDocument(request: DeleteDocumentRequest): Observable<DeleteDocumentReply>;
}

export interface DocumentServiceController {
  saveDocument(
    request: SaveDocumentRequest,
  ): Promise<SaveDocumentReply> | Observable<SaveDocumentReply> | SaveDocumentReply;

  getDocumentList(
    request: GetDocumentListRequest,
  ): Promise<GetDocumentListReply> | Observable<GetDocumentListReply> | GetDocumentListReply;

  getDocument(request: GetDocumentRequest): Promise<GetDocumentReply> | Observable<GetDocumentReply> | GetDocumentReply;

  updateDocument(
    request: UpdateDocumentRequest,
  ): Promise<UpdateDocumentReply> | Observable<UpdateDocumentReply> | UpdateDocumentReply;

  deleteDocument(
    request: DeleteDocumentRequest,
  ): Promise<DeleteDocumentReply> | Observable<DeleteDocumentReply> | DeleteDocumentReply;
}

export function DocumentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "saveDocument",
      "getDocumentList",
      "getDocument",
      "updateDocument",
      "deleteDocument",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("DocumentService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("DocumentService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const DOCUMENT_SERVICE_NAME = "DocumentService";
