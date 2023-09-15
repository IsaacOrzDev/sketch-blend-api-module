import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthenticateGithubUserDto,
  SendEmailForPasswordLessDto,
  VerifyTokenDto,
} from './auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/google/verify')
  async verifyGoogleIdToken(@Body() dto: VerifyTokenDto) {
    const verifiedResult = await this.authService.verifyGoogleIdToken(
      dto.token,
    );
    return verifiedResult;
  }

  @Post('/google/authenticate')
  async authenticateGoogleUser(@Body() dto: AuthenticateGithubUserDto) {
    const authResult = await this.authService.authenticateGoogleUser(dto.code);
    if (!!authResult['error']) {
      return { error: 'Cannot authenticate with Google' };
    }
    try {
      const token = await this.authService.generateAccessToken();
      return { success: true, ...token };
    } catch (err) {
      console.log(err.message);
      return { error: err.message };
    }
  }

  @Post('/github/authenticate')
  async authenticateGithubUser(@Body() dto: AuthenticateGithubUserDto) {
    const authResult = await this.authService.authenticateGithubUser(dto.code);
    if (!authResult.login) {
      return { error: 'Cannot authenticate with Github' };
    }
    try {
      const token = await this.authService.generateAccessToken();
      return { success: true, ...token };
    } catch (err) {
      console.log(err.message);
      return { error: err.message };
    }
  }

  @Post('/password-less/send-email')
  async sendEmailForPasswordLess(@Body() dto: SendEmailForPasswordLessDto) {
    return this.authService.sendEmailForPasswordLess(dto.email);
  }

  @Post('/password-less/signin')
  async signInWithPasswordLessToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyPasswordLessToken(dto.token);
  }

  @Post('/access-token/generate')
  async generateAccessToken() {
    return this.authService.generateAccessToken();
  }
}
