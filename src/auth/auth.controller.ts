import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyGoogleIdTokenDto } from './auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/google/verify')
  async verifyGoogleIdToken(@Body() dto: VerifyGoogleIdTokenDto) {
    return this.authService.verifyGoogleIdToken(dto.token);
  }
}
