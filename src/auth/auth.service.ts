import { Injectable } from '@nestjs/common';
import { OAuth2Client as GoogleOAuth2Client } from 'google-auth-library';
import { EmailService } from 'src/email/email.service';
import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { UserService } from 'src/user/user.service';
import { LoginMethod } from '@prisma/client';
import AccessTokenService from './access-token.service';
import { UserGrpc } from 'src/proxy/user.grpc';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private googleClient: GoogleOAuth2Client;

  constructor(
    private emailService: EmailService,
    private userService: UserService,
    private accessTokenService: AccessTokenService,
    private userGrpc: UserGrpc,
  ) {
    this.googleClient = new GoogleOAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage',
    );
  }

  private async verifyGoogleIdToken(token: string) {
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
    imageUrl?: string;
    method: LoginMethod;
    data?: any;
  }) {
    const findUserResult = await this.userService.findUser({
      email: data.email,
      name: data.name,
      method: data.method,
    });

    const userResult = await firstValueFrom(
      this.userGrpc.client.findUser({
        email: data.email,
        name: data.name,
        loginMethod: data.method,
      }),
    );

    if (!userResult.user) {
      await firstValueFrom(
        this.userGrpc.client.createUser({
          name: data.name,
          email: data.email,
          login: {
            method: data.method,
            data: data.data,
            imageUrl: data.imageUrl,
          },
        }),
      );
    } else {
      await firstValueFrom(
        this.userGrpc.client.loginUser({
          id: userResult.user.id,
          login: {
            method: data.method,
            data: data.data,
            imageUrl: data.imageUrl,
          },
        }),
      );
    }

    const token = await this.accessTokenService.generateAccessToken({
      username: data.name,
      email: data.email,
      imageUrl: data.imageUrl,
      durationType: '1d',
    });

    return {
      ...token,
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

    data.append('redirect_uri', `${process.env.PORTAL_URL}/api/auth/github`);
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

    if (accessTokenResult.error) {
      throw new Error(accessTokenResult.error_description);
    }

    const userResult = await fetch(`https://api.github.com/user`, {
      method: 'GET',
      headers: {
        Authorization: `token ${accessTokenResult.access_token}`,
      },
    }).then((res) => res.json());

    if (!!userResult.message && userResult.message.includes('Bad')) {
      throw new Error(userResult.message);
    }

    return this.processAuthentication({
      email: userResult.email,
      name: userResult.name,
      imageUrl: userResult.avatar_url,
      data: userResult,
      method: LoginMethod.GITHUB,
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

  public async authenticatePasswordLessLogin(token: string) {
    const result =
      await this.accessTokenService.verifyOneTimeAccessToken(token);

    return this.processAuthentication({
      email: result.email,
      name: result.username ?? '',
      method: LoginMethod.PASSWORD_LESS,
    });
  }
}
