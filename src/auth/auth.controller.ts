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

  @Post('/google/authenticate')
  async authenticateGoogleUser(@Body() dto: AuthenticateGithubUserDto) {
    try {
      const result = await this.authService.authenticateGoogleUser(dto.code);
      const token = await this.authService.generateAccessToken();
      return { success: true, ...token, isFirstTime: result.isFirstTime };
    } catch (err) {
      console.log(err);
      throw new Error('Cannot authenticate with Google');
    }
  }

  @Post('/github/authenticate')
  async authenticateGithubUser(@Body() dto: AuthenticateGithubUserDto) {
    try {
      await this.authService.authenticateGithubUser(dto.code);
      const token = await this.authService.generateAccessToken();
      return { success: true, ...token };
    } catch (err) {
      console.log(err);
      throw new Error('Cannot authenticate with Github');
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

  @Post('/access-token/verify')
  async verifyAccessToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyAccessToken(dto.token);
  }
}
