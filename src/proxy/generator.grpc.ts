import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  GENERATOR_PACKAGE_NAME,
  GENERATOR_SERVICE_NAME,
  GeneratorServiceClient,
} from 'src/proto/generator';

@Injectable()
export class GeneratorGrpc {
  constructor(@Inject(GENERATOR_PACKAGE_NAME) private grpc: ClientGrpc) {}

  public client: GeneratorServiceClient;

  onModuleInit() {
    this.client = this.grpc.getService(GENERATOR_SERVICE_NAME);
  }
}
