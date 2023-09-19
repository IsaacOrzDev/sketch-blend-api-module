import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: 'SUB_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          url: process.env.SUB_SERVICE_PORT,
          protoPath: join(__dirname, '../', 'proto/user.proto'),
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
