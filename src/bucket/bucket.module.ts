import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import BucketService from './bucket.service';
import { BucketController } from './bucket.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BucketService],
  controllers: [BucketController],
  exports: [BucketService],
})
export class BucketModule {}
