import { Injectable } from '@nestjs/common';
import { OAuth2Client as GoogleOAuth2Client } from 'google-auth-library';
import { EmailService } from 'src/email/email.service';
import fetch from 'node-fetch';
import * as FormData from 'form-data';
import AccessTokenService from './access-token.service';
import { UserGrpc } from 'src/proxy/user.grpc';
import { firstValueFrom } from 'rxjs';
import { SendEmailForPasswordLessDto } from './auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private googleClient: GoogleOAuth2Client;

  constructor(
    private emailService: EmailService,
    private accessTokenService: AccessTokenService,
    private userGrpc: UserGrpc,
    private userService: UserService,
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
    method: string;
    data?: any;
  }) {
    let userId = undefined;
    const userResult = await firstValueFrom(
      this.userGrpc.client.findUser({
        email: data.email,
        name: data.name,
        loginMethod: data.method,
      }),
    );

    let userReply = null;

    if (!userResult.user) {
      const newUserResult = await firstValueFrom(
        this.userGrpc.client.createUser({
          name: data.name,
          email: data.email,
          login: {
            method: data.method,
            data: data.data ?? {},
            imageUrl: data.imageUrl ?? '',
          },
        }),
      );
      userId = newUserResult.user.id;
      await this.userService.addUserInfo({
        userId: newUserResult.user.id,
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
      });
    } else {
      userId = userResult.user.id;
      userReply = await firstValueFrom(
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
      userId,
      username: userReply?.user?.name ?? data.name,
      email: userReply?.user?.email ?? data.email,
      imageUrl: userReply?.user?.imageUrl ?? data.imageUrl,
      durationType: '1d',
    });

    return {
      ...token,
      isFirstTime: !userResult.user,
    };
  }

  public async authenticateGoogleUser(code: string) {
    const tokenResult = await this.googleClient.getToken(code);
    const payload = await this.verifyGoogleIdToken(tokenResult.tokens.id_token);
    return this.processAuthentication({
      email: payload.email,
      name: payload.name,
      imageUrl: payload.picture,
      method: 'google',
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
      method: 'github',
    });
  }

  public async sendEmailForPasswordLess(data: SendEmailForPasswordLessDto) {
    const result = await this.accessTokenService.addOneTimeAccessToken({
      email: data.email,
      username: data.username,
    });

    return this.emailService.sendEmail({
      to: [data.email],
      subject: 'SketchBlend: Sign In',
      template: 'sketch-blend-login-template',
      data: {
        subject: 'SketchBlend: Sign In',
        url: `${process.env.PORTAL_URL}/api/auth/password-less?token=${result.accessToken}`,
        time: Date.now(),
      },
    });
  }

  public async authenticatePasswordLessLogin(token: string) {
    const result =
      await this.accessTokenService.verifyOneTimeAccessToken(token);

    return this.processAuthentication({
      email: result.email,
      name: result.username ?? '',
      method: 'password-less',
    });
  }
}
