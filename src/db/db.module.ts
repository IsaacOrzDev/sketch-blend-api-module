import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [DbService],
  controllers: [],
  exports: [DbService],
})
export class DbModule {}