import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { firstValueFrom } from 'rxjs';
import { AuthUser } from 'src/decorator/user';
import { DocumentGrpc } from 'src/proxy/document.grpc';

@Injectable()
export class DocumentService {
  constructor(
    private documentGrpc: DocumentGrpc,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  public async checkIsUserDocument(user: AuthUser, documentId: string) {
    if (!user.userId || !documentId) {
      return undefined;
    }

    const result = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: documentId,
      }),
    );

    if (!result.record) {
      throw new Error('Not allowed');
    }

    const checking = user.userId === result.record.userId;
    if (!checking) {
      throw new Error('Not allowed');
    }

    return result;
  }

  public async getCachedList(params: {
    userId: number;
    offset: number;
    limit: number;
  }) {
    const cached = await this.redis.get(
      `documents:userId:${params.userId}:offset:${params.offset}:limit:${params.limit}`,
    );
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  }

  public async setCachedList(params: {
    userId: number;
    offset: number;
    limit: number;
    data: any;
  }) {
    await this.redis.set(
      `documents:userId:${params.userId}:offset:${params.offset}:limit:${params.limit}`,
      JSON.stringify(params.data),
      'EX',
      60 * 5,
    );
  }

  public async deleteCachedList(params: { userId: number }) {
    const keys = await this.redis.keys(`documents:userId:${params.userId}:*`);
    for (const key of keys) {
      await this.redis.del(key);
    }
  }
}
