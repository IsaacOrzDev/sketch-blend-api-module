import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SendEmailForPasswordLessDto,
  VerifyTokenDto,
  verifyPasswordLessToken,
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
    if (!!verifiedResult['error']) {
      return verifiedResult;
    }
    try {
      if (dto.withAccessToken) {
        const token = await this.authService.generateAccessToken();
        return { success: true, ...token };
      }
      return { success: true };
    } catch (err) {
      console.log(err.message);
      return { error: 'Internal server error' };
    }
  }

  @Post('/github/verify')
  async verifyGithubAccessToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyGithubAccessToken(dto.token);
  }

  @Post('/password-less/send-email')
  async sendEmailForPasswordLess(@Body() dto: SendEmailForPasswordLessDto) {
    return this.authService.sendEmailForPasswordLess(dto.email);
  }

  @Post('/password-less/verify')
  async verifyPasswordLessToken(@Body() dto: verifyPasswordLessToken) {
    return this.authService.verifyPasswordLessToken(dto.token);
  }

  @Post('/access-token/generate')
  async generateAccessToken() {
    return this.authService.generateAccessToken();
  }
}
