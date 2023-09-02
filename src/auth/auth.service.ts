import { Injectable } from '@nestjs/common';
import { OAuth2Client as GoogleOAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor() {}

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
}
