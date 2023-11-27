import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from './proxy/proxy.module';
import { AuthModule } from './auth/auth.module';
import { GeneratorModule } from './generator/generator.module';
import { DocumentModule } from './document/document.module';
import { BucketModule } from './bucket/bucket.module';
import { PostModule } from './post/post.module';
import { DevModule } from './dev/dev.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    RedisModule.forRoot({
      config: {
        url: process.env.REDIS_URL,
        tls: {},
      },
    }),
    ProxyModule,
    AuthModule,
    GeneratorModule,
    DocumentModule,
    BucketModule,
    PostModule,
    DevModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
