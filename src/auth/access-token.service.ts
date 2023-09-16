import { Injectable } from '@nestjs/common';
import { AddOneTimeTokenDto } from './auth.dto';
import { DbService } from 'src/db/db.service';
import { MqttService } from 'src/proxy/mqtt.service';
import { MqttTopic } from 'src/proxy/mqtt-topic.config';

@Injectable()
export default class AccessTokenService {
  constructor(
    private dbService: DbService,
    private mqttService: MqttService,
  ) {}

  public async generateAccessToken(data: {
    userId?: string;
    username?: string;
    email?: string;
    imageUrl?: string;
    durationType?: '1d' | '10m';
  }) {
    const duration = data.durationType === '1d' ? 86400000 : 600000; //milliseconds
    if (process.env.IS_MICROSERVICE) {
      return this.mqttService.publish(MqttTopic.GENERATE_ACCESS_TOKEN, {
        userId: data.userId,
        username: data.username,
        email: data.email,
        imageUrl: data.imageUrl,
        duration,
      });
    }
    return '';
  }

  public async verifyAccessToken(token: string) {
    if (process.env.IS_MICROSERVICE) {
      const verifiedResult = await this.mqttService.publish(
        MqttTopic.VERIFY_ACCESS_TOKEN,
        {
          token,
        },
      );
      if (verifiedResult.error) {
        throw new Error(verifiedResult.error);
      }
      return {
        ...verifiedResult,
        userId: verifiedResult.user_id,
        imageUrl: verifiedResult.image_url,
      };
    }
    throw new Error('Cannot verify access token');
  }

  public async addOneTimeAccessToken(data: AddOneTimeTokenDto) {
    const tokenResult: {
      token: string;
      expiredAt: string;
    } = await this.generateAccessToken({
      username: data.username,
      email: data.email,
      durationType: '10m',
    });

    await this.dbService.client.oneTimeToken.create({
      data: {
        token: tokenResult.token,
        email: data.email,
        name: data.username,
      },
    });

    return tokenResult;
  }

  public async verifyOneTimeAccessToken(token: string) {
    const tokenRecord = await this.dbService.client.oneTimeToken.findUnique({
      where: {
        token,
      },
    });

    if (!tokenRecord) {
      throw new Error('Token is not valid');
    }

    await this.verifyAccessToken(token);

    await this.dbService.client.oneTimeToken.delete({
      where: {
        id: tokenRecord.id,
      },
    });

    return {
      email: tokenRecord.email,
      username: tokenRecord.name,
    };
  }
}
