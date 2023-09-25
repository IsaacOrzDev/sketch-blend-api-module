import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { USER_PACKAGE_NAME } from 'src/grpc/proto/user';
import { join } from 'path';
import { ACCESS_TOKEN_PACKAGE_NAME } from 'src/grpc/proto/access_token';
import { AccessTokenGrpc } from './access-token.grpc';
import { GENERATOR_PACKAGE_NAME } from 'src/grpc/proto/generator';
import { UserGrpc } from './user.grpc';
import { GeneratorGrpc } from './generator.grpc';
import { DOCUMENT_PACKAGE_NAME } from 'src/grpc/proto/document';
import { DocumentGrpc } from './document.grpc';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: ACCESS_TOKEN_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: ACCESS_TOKEN_PACKAGE_NAME,
          url: process.env.USER_MODULE_URL,
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
          url: process.env.USER_MODULE_URL,
          protoPath: join(__dirname, '../', 'proto/user.proto'),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: GENERATOR_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: GENERATOR_PACKAGE_NAME,
          url: process.env.GENERATOR_MODULE_URL,
          protoPath: join(__dirname, '../', 'proto/generator.proto'),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: DOCUMENT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: DOCUMENT_PACKAGE_NAME,
          url: process.env.DOCUMENT_MODULE_URL,
          protoPath: join(__dirname, '../', 'proto/document.proto'),
        },
      },
    ]),
  ],
  providers: [AccessTokenGrpc, UserGrpc, GeneratorGrpc, DocumentGrpc],
  exports: [AccessTokenGrpc, UserGrpc, GeneratorGrpc, DocumentGrpc],
})
export class ProxyModule {}
