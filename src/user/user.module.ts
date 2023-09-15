import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [ConfigModule.forRoot(), DbModule],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
