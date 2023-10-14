import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from './proxy/proxy.module';
import { AuthModule } from './auth/auth.module';
import { GeneratorModule } from './generator/generator.module';
import { DocumentModule } from './document/document.module';
import { BucketModule } from './bucket/bucket.module';
import { PostModule } from './post/post.module';
import { TestingModule } from './testing/testing.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProxyModule,
    AuthModule,
    GeneratorModule,
    DocumentModule,
    BucketModule,
    PostModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
