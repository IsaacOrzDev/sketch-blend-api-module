import { Injectable } from '@nestjs/common';
import { AddOneTimeTokenDto } from './auth.dto';
import { firstValueFrom } from 'rxjs';
import { AccessTokenGrpc } from 'src/proxy/access-token.grpc';
import * as dayjs from 'dayjs';

@Injectable()
export default class AccessTokenService {
  constructor(private accessTokenGrpc: AccessTokenGrpc) {}

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
    const tokenResult = await firstValueFrom(
      this.accessTokenGrpc.client.addOneTimeAccessToken({
        email: data.email,
        username: data.username,
        durationType: '10m',
      }),
    );

    return tokenResult;
  }

  public async verifyOneTimeAccessToken(token: string) {
    const verifyResult = await firstValueFrom(
      this.accessTokenGrpc.client.verifyOneTimeAccessToken({
        accessToken: token,
      }),
    );

    return verifyResult;
  }
}
