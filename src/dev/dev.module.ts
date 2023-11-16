import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';
import { DevController } from './dev.controller';
import { AuthModule } from '../auth/auth.module';
import { BucketModule } from 'src/bucket/bucket.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProxyModule,
    AuthModule,
    BucketModule,
    ImageModule,
  ],
  providers: [],
  controllers: [DevController],
  exports: [],
})
export class DevModule {}
