import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendEmailForPasswordLessDto, VerifyTokenDto } from './auth.dto';
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

  @Post('/google/signin')
  async signInWithGoogleIdToken(@Body() dto: VerifyTokenDto) {
    const verifiedResult = await this.authService.verifyGoogleIdToken(
      dto.token,
    );
    if (!!verifiedResult['error']) {
      return verifiedResult;
    }
    try {
      const token = await this.authService.generateAccessToken();
      return { success: true, ...token };
    } catch (err) {
      console.log(err.message);
      return { error: 'Internal server error' };
    }
  }

  @Post('/github/verify')
  async verifyGithubAccessToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyGithubAccessToken(dto.token);
  }

  @Post('/github/signin')
  async signInWithGithubAccessToken(@Body() dto: VerifyTokenDto) {
    const verifiedResult = this.authService.verifyGithubAccessToken(dto.token);
    if (!!verifiedResult['error']) {
      return verifiedResult;
    }
    try {
      const token = await this.authService.generateAccessToken();
      return { success: true, ...token };
    } catch (err) {
      console.log(err.message);
      return { error: 'Internal server error' };
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
