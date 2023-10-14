import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DocumentModule } from 'src/document/document.module';
import { BucketModule } from 'src/bucket/bucket.module';
import { ProxyModule } from 'src/proxy/proxy.module';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DocumentModule,
    BucketModule,
    ProxyModule,
    DbModule,
    AuthModule,
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [],
})
export class PostModule {}
