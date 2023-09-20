import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'src/proto/user';

@Injectable()
export class GrpcForwardService {
  constructor(@Inject(USER_PACKAGE_NAME) private grpc: ClientGrpc) {}

  public userServiceClient: UserServiceClient;

  onModuleInit() {
    this.userServiceClient = this.grpc.getService(USER_SERVICE_NAME);
  }
}
