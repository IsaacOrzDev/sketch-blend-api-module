import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { UserService } from './user.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [ProxyModule, DbModule],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
