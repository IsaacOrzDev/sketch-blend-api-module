import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserClient,
} from 'src/proto/user';

@Injectable()
export class GrpcForwardService {
  constructor(@Inject(USER_PACKAGE_NAME) private grpc: ClientGrpc) {}

  public userClient: UserClient;

  onModuleInit() {
    this.userClient = this.grpc.getService(USER_SERVICE_NAME);
  }
}
