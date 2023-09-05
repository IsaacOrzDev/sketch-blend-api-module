import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendEmailForPasswordLessDto, VerifyTokenDto } from './auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/google/verify')
  async verifyGoogleIdToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyGoogleIdToken(dto.token);
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
  async verifyPasswordLessToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyPasswordLessToken(dto.token);
  }

  @Post('/access-token/generate')
  async generateAccessToken() {
    return this.authService.generateAccessToken();
  }
}
