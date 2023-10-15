import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {
  CreatePostDto,
  DeletePostDto,
  GetPostListDto,
  LikePostDto,
} from './post.dto';
import { DocumentGrpc } from 'src/proxy/document.grpc';
import BucketService from 'src/bucket/bucket.service';
import { firstValueFrom } from 'rxjs';
import { AuthUser } from 'src/decorator/user';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private documentGrpc: DocumentGrpc,
    private bucketService: BucketService,
  ) {}

  public async getPosts(data: GetPostListDto) {
    return this.prismaService.client.post.findMany({
      take: data.limit,
      skip: data.offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        userInfo: true,
      },
    });
  }

  public async createPost(data: CreatePostDto, userId: number) {
    const document = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: data.documentId,
      }),
    );

    const post = await this.prismaService.client.post.create({
      data: {
        prompt: data.prompt,
        imageUrl: '',
        sourceImageUrl: '',
        authorId: userId,
        documentId: data.documentId,
      },
    });

    await this.bucketService.downloadAndUploadToS3({
      url: data.imageUrl,
      fileName: `${post.id}/generated.png`,
    });

    if (!document.record) {
      return false;
    }

    await this.bucketService.convertBase64ToBufferAndUpload({
      base64: document.record.image.replace('data:image/png;base64,', ''),
      fileName: `${post.id}/source.png`,
    });

    const result = await this.prismaService.client.post.update({
      where: {
        id: post.id,
      },
      data: {
        sourceImageUrl: `${process.env.IMAGES_URL}/${post.id}/source.png`,
        imageUrl: `${process.env.IMAGES_URL}/${post.id}/generated.png`,
      },
    });
    return result;
  }

  public async setImageUrl(data: { postId: string; imageUrl: string }) {
    return this.prismaService.client.post.update({
      where: {
        id: data.postId,
      },
      data: {
        imageUrl: data.imageUrl,
      },
    });
  }

  public async checkIsUserPost(user: AuthUser, postId: string) {
    const record = await this.prismaService.client.post.findFirst({
      where: {
        id: postId,
        authorId: user.userId,
      },
    });

    if (!record) {
      throw new Error('Not allowed');
    }

    return true;
  }

  public async deletePost(data: DeletePostDto) {
    return this.prismaService.client.post.delete({
      where: {
        id: data.id,
      },
    });
  }

  public async likePost(data: LikePostDto, userId: number) {
    await this.prismaService.client.like.create({
      data: {
        userId,
        postId: data.id,
      },
    });
    return true;
  }

  public async unlikePost(data: LikePostDto, userId: number) {
    await this.prismaService.client.like.deleteMany({
      where: {
        userId,
        postId: data.id,
      },
    });
    return true;
  }
}
