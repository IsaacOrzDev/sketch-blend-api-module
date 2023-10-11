import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreatePostDto, DeletePostDto, GetPostListDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  public async getPosts(data: GetPostListDto) {
    return this.prismaService.client.post.findMany({
      take: data.limit,
      skip: data.offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async createPost(data: CreatePostDto, userId: number) {
    return this.prismaService.client.post.create({
      data: {
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        sourceImageUrl: data.sourceImageUrl,
        authorId: userId,
      },
    });
  }

  public async deletePost(data: DeletePostDto) {
    return this.prismaService.client.post.delete({
      where: {
        id: data.postId,
      },
    });
  }

  public async likePost() {}

  public async unlikePost() {}
}
