import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ACCESS_TOKEN_PACKAGE_NAME,
  ACCESS_TOKEN_SERVICE_NAME,
  AccessTokenServiceClient,
} from 'src/grpc/proto/access_token';

@Injectable()
export class AccessTokenGrpc {
  constructor(@Inject(ACCESS_TOKEN_PACKAGE_NAME) private grpc: ClientGrpc) {}

  public client: AccessTokenServiceClient;

  onModuleInit() {
    this.client = this.grpc.getService(ACCESS_TOKEN_SERVICE_NAME);
  }
}
