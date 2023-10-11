import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { UserService } from './user.service';

@Module({
  imports: [ProxyModule],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
