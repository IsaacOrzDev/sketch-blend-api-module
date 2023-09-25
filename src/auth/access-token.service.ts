import { Injectable } from '@nestjs/common';
import { AddOneTimeTokenDto } from './auth.dto';
import { DbService } from 'src/db/db.service';
import { firstValueFrom } from 'rxjs';
import { AccessTokenGrpc } from 'src/proxy/access-token.grpc';
import * as dayjs from 'dayjs';

@Injectable()
export default class AccessTokenService {
  constructor(
    private dbService: DbService,
    private accessTokenGrpc: AccessTokenGrpc,
  ) {}

  public async generateAccessToken(data: {
    userId?: string;
    username?: string;
    email?: string;
    imageUrl?: string;
    durationType?: '1d' | '10m';
  }) {
    const result = await firstValueFrom(
      this.accessTokenGrpc.client.generateAccessToken({
        userId: !Number.isNaN(data.userId) ? Number(data.userId) : undefined,
        username: data.username,
        email: data.email,
        imageUrl: data.imageUrl,
        durationType: data.durationType,
      }),
    );
    console.log('result.expiresAtUtc.seconds', result.expiresAtUtc.seconds);
    return {
      ...result,
      expiresAtUtc: dayjs
        .unix((result.expiresAtUtc.seconds as any).low)
        .toDate(),
    };
  }

  public async verifyAccessToken(token: string) {
    const result = await firstValueFrom(
      this.accessTokenGrpc.client.verifyAccessToken({
        accessToken: token,
      }),
    );
    if (result.isValid) {
      return {
        ...result,
      };
    }
    throw new Error('Cannot verify access token');
  }

  public async addOneTimeAccessToken(data: AddOneTimeTokenDto) {
    const tokenResult = await this.generateAccessToken({
      username: data.username,
      email: data.email,
      durationType: '10m',
    });

    await this.dbService.client.oneTimeAccessToken.create({
      data: {
        token: tokenResult.accessToken,
        email: data.email,
        username: data.username,
      },
    });

    return tokenResult;
  }

  public async verifyOneTimeAccessToken(token: string) {
    const tokenRecord =
      await this.dbService.client.oneTimeAccessToken.findUnique({
        where: {
          token,
        },
      });

    if (!tokenRecord) {
      throw new Error('Token is not valid');
    }

    await this.verifyAccessToken(token);

    await this.dbService.client.oneTimeAccessToken.delete({
      where: {
        id: tokenRecord.id,
      },
    });

    return {
      email: tokenRecord.email,
      username: tokenRecord.username,
    };
  }
}
