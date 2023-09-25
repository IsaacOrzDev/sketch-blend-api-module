/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Timestamp } from '../google/protobuf/timestamp';

export const protobufPackage = 'document';

export interface SaveDocumentRequest {
  title: string;
  content: string;
}

export interface SaveDocumentReply {
  id: string;
}

export interface GetDocumentListRequest {
  page: number;
  size: number;
}

export interface GetDocumentListReply {
  documents: Document[];
}

export interface GetDocumentRequest {
  id: string;
}

export interface GetDocumentReply {
  document: Document | undefined;
}

export interface UpdateDocumentRequest {
  id: string;
  title: string;
  content: string;
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

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp | undefined;
  updatedAt: Timestamp | undefined;
}

export const DOCUMENT_PACKAGE_NAME = 'document';

export interface DocumentServiceClient {
  saveDocument(request: SaveDocumentRequest): Observable<SaveDocumentReply>;

  getDocumentList(
    request: GetDocumentListRequest,
  ): Observable<GetDocumentListReply>;

  getDocument(request: GetDocumentRequest): Observable<GetDocumentReply>;

  updateDocument(
    request: UpdateDocumentRequest,
  ): Observable<UpdateDocumentReply>;

  deleteDocument(
    request: DeleteDocumentRequest,
  ): Observable<DeleteDocumentReply>;
}

export interface DocumentServiceController {
  saveDocument(
    request: SaveDocumentRequest,
  ):
    | Promise<SaveDocumentReply>
    | Observable<SaveDocumentReply>
    | SaveDocumentReply;

  getDocumentList(
    request: GetDocumentListRequest,
  ):
    | Promise<GetDocumentListReply>
    | Observable<GetDocumentListReply>
    | GetDocumentListReply;

  getDocument(
    request: GetDocumentRequest,
  ):
    | Promise<GetDocumentReply>
    | Observable<GetDocumentReply>
    | GetDocumentReply;

  updateDocument(
    request: UpdateDocumentRequest,
  ):
    | Promise<UpdateDocumentReply>
    | Observable<UpdateDocumentReply>
    | UpdateDocumentReply;

  deleteDocument(
    request: DeleteDocumentRequest,
  ):
    | Promise<DeleteDocumentReply>
    | Observable<DeleteDocumentReply>
    | DeleteDocumentReply;
}

export function DocumentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'saveDocument',
      'getDocumentList',
      'getDocument',
      'updateDocument',
      'deleteDocument',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('DocumentService', method)(
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
      GrpcStreamMethod('DocumentService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const DOCUMENT_SERVICE_NAME = 'DocumentService';
