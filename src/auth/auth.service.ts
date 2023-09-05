import { Injectable } from '@nestjs/common';
import { OAuth2Client as GoogleOAuth2Client } from 'google-auth-library';
import { MqttTopic } from 'src/proxy/mqtt-topic.config';
import { MqttService } from 'src/proxy/mqtt.service';

@Injectable()
export class AuthService {
  constructor(private mqttService: MqttService) {}

  public async verifyGoogleIdToken(token: string) {
    try {
      const client = new GoogleOAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (err) {
      console.log(err.message);
      return { error: 'Token is not valid' };
    }
  }

  public async verifyGithubAccessToken(token: string) {
    const verifiedResult = await this.mqttService.publish(
      MqttTopic.VERIFY_GITHUB_ACCESS_TOKEN,
      {
        token,
      },
    );

    return !verifiedResult.error;
  }

  public async verifyAccessToken(token: string) {
    const verifiedResult = await this.mqttService.publish(
      MqttTopic.VERIFY_ACCESS_TOKEN,
      {
        token,
      },
    );

    return !verifiedResult.error;
  }

  public async generateAccessToken() {
    return this.mqttService.publish(MqttTopic.GENERATE_ACCESS_TOKEN, {
      userId: 'userId',
      username: 'username',
    });
  }

  public async sendEmailForPasswordLess(email: string) {
    console.log('email', email);
  }

  public async verifyPasswordLessToken(token: string) {
    return this.mqttService.publish(MqttTopic.VERIFY_PASSWORD_LESS_TOKEN, {
      token,
    });
  }
}
