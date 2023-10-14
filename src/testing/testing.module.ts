import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';
import { TestingController } from './testing.controller';
import { AuthModule } from '../auth/auth.module';
import { BucketModule } from 'src/bucket/bucket.module';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule, AuthModule, BucketModule],
  providers: [],
  controllers: [TestingController],
  exports: [],
})
export class TestingModule {}
