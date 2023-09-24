import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { USER_PACKAGE_NAME } from 'src/proto/user';
import { join } from 'path';
import { GrpcForwardService } from './grpc-forward.service';
import { ACCESS_TOKEN_PACKAGE_NAME } from 'src/proto/access_token';
import { AccessTokenGrpc } from './access-token.grpc';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: ACCESS_TOKEN_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: ACCESS_TOKEN_PACKAGE_NAME,
          url: process.env.USER_MODULE_PORT,
          protoPath: join(__dirname, '../', 'proto/access_token.proto'),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          url: process.env.USER_MODULE_PORT,
          protoPath: join(__dirname, '../', 'proto/user.proto'),
        },
      },
    ]),
  ],
  providers: [GrpcForwardService, AccessTokenGrpc],
  exports: [GrpcForwardService, AccessTokenGrpc],
})
export class ProxyModule {}
