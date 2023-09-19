import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { ProxyModule } from 'src/proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    forwardRef(() => AuthModule),
    ProxyModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
