import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PostService],
  controllers: [PostController],
  exports: [],
})
export class PostModule {}
