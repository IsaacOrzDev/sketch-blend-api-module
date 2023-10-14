import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import BucketService from './bucket.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BucketService],
  controllers: [],
  exports: [BucketService],
})
export class BucketModule {}
