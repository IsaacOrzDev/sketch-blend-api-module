import { Injectable } from '@nestjs/common';
import { OAuth2Client as GoogleOAuth2Client } from 'google-auth-library';
import { EmailService } from 'src/email/email.service';
import { MqttTopic } from 'src/proxy/mqtt-topic.config';
import { MqttService } from 'src/proxy/mqtt.service';
import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { UserService } from 'src/user/user.service';
import { LoginMethod } from '@prisma/client';

@Injectable()
export class AuthService {
  private googleClient: GoogleOAuth2Client;

  constructor(
    private mqttService: MqttService,
    private emailService: EmailService,
    private userService: UserService,
  ) {
    this.googleClient = new GoogleOAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );
  }

  public async verifyGoogleIdToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (err) {
      console.log(err.message);
      throw new Error('Id token is not valid');
    }
  }

  private async processAuthentication(data: {
    email: string;
    name: string;
    imageUrl: string;
    method: LoginMethod;
    data?: any;
  }) {
    const findUserResult = await this.userService.findUser({
      email: data.email,
      name: data.name,
      method: data.method,
    });
    if (!findUserResult) {
      await this.userService.createUser({
        name: data.name,
        email: data.email,
        login: {
          method: LoginMethod.GOOGLE,
          data: data.data,
          imageUrl: data.imageUrl,
        },
      });
    }
    return {
      name: data.name,
      email: data.email,
      imageUrl: data.imageUrl,
      isFirstTime: !findUserResult,
    };
  }

  public async authenticateGoogleUser(code: string) {
    const tokenResult = await this.googleClient.getToken(code);
    const payload = await this.verifyGoogleIdToken(tokenResult.tokens.id_token);
    return this.processAuthentication({
      email: payload.email,
      name: payload.name,
      imageUrl: payload.picture,
      method: LoginMethod.GOOGLE,
      data: payload,
    });
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
    if (process.env.IS_MICROSERVICE) {
      const verifiedResult = await this.mqttService.publish(
        MqttTopic.VERIFY_ACCESS_TOKEN,
        {
          token,
        },
      );
      return !verifiedResult.error;
    }
  }

  public async generateAccessToken() {
    if (process.env.IS_MICROSERVICE) {
      return this.mqttService.publish(MqttTopic.GENERATE_ACCESS_TOKEN, {
        userId: 'userId',
        username: 'username',
      });
    }
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
