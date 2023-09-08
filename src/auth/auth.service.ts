import { Injectable } from '@nestjs/common';
import { OAuth2Client as GoogleOAuth2Client } from 'google-auth-library';
import { EmailService } from 'src/email/email.service';
import { MqttTopic } from 'src/proxy/mqtt-topic.config';
import { MqttService } from 'src/proxy/mqtt.service';
import fetch from 'node-fetch';
import * as FormData from 'form-data';

@Injectable()
export class AuthService {
  constructor(
    private mqttService: MqttService,
    private emailService: EmailService,
  ) {}

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

  public async authenticateGithubUser(code: string) {
    const data = new FormData();
    data.append('client_id', process.env.GITHUB_CLIENT_ID);
    data.append('client_secret', process.env.GITHUB_CLIENT_SECRET);
    data.append('code', code);
    data.append('redirect_uri', 'http://localhost:3000');
    const accessTokenResult = await fetch(
      `https://github.com/login/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: data as any,
      },
    ).then((res) => res.json());

    const userResult = await fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: {
        Authorization: `token ${accessTokenResult.access_token}`,
      },
    }).then((res) => res.json());
    console.log(userResult);
    return userResult;
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
    return this.emailService.sendEmail({
      to: [email],
      subject: 'Demo-System: Sign In',
      template: 'testing-template',
      data: {
        message: 'Sign in',
        subject: 'Demo-System: Sign In',
      },
    });
  }

  public async verifyPasswordLessToken(token: string) {
    return this.mqttService.publish(MqttTopic.VERIFY_PASSWORD_LESS_TOKEN, {
      token,
    });
  }
}
