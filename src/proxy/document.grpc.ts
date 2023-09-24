import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  DOCUMENT_PACKAGE_NAME,
  DOCUMENT_SERVICE_NAME,
  DocumentServiceClient,
} from 'src/proto/document';

@Injectable()
export class DocumentGrpc {
  constructor(@Inject(DOCUMENT_PACKAGE_NAME) private grpc: ClientGrpc) {}

  public client: DocumentServiceClient;

  onModuleInit() {
    this.client = this.grpc.getService(DOCUMENT_SERVICE_NAME);
  }
}
