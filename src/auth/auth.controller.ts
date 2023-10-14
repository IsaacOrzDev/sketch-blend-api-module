import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthenticateGithubUserDto,
  AuthenticateResponse,
  SendEmailForPasswordLessDto,
  VerifyTokenDto,
  VerifyTokenResponse,
} from './auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiFormattedResponse } from 'src/decorator/api-response';
import AccessTokenService from './access-token.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private accessTokenService: AccessTokenService,
  ) {}

  @ApiFormattedResponse({
    type: AuthenticateResponse,
    isCreated: true,
    successDescription: 'Authenticate with Google',
    errorDescription: 'Cannot authenticate with Google',
  })
  @Post('/google/authenticate')
  async authenticateGoogleUser(@Body() dto: AuthenticateGithubUserDto) {
    try {
      const result = await this.authService.authenticateGoogleUser(dto.code);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot authenticate with Google');
    }
  }

  @ApiFormattedResponse({
    type: AuthenticateResponse,
    isCreated: true,
    successDescription: 'Authenticate with Github',
    errorDescription: 'Cannot authenticate with Github',
  })
  @Post('/github/authenticate')
  async authenticateGithubUser(@Body() dto: AuthenticateGithubUserDto) {
    try {
      const result = await this.authService.authenticateGithubUser(dto.code);
      return result;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot authenticate with Github');
    }
  }

  @Post('/password-less/send-email')
  async sendEmailForPasswordLess(@Body() dto: SendEmailForPasswordLessDto) {
    return this.authService.sendEmailForPasswordLess(dto);
  }

  @ApiFormattedResponse({
    type: AuthenticateResponse,
    isCreated: true,
    successDescription: 'Authenticate with Email',
    errorDescription: 'Cannot authenticate with Email',
  })
  @Post('/password-less/authenticate')
  async AuthenticatePasswordLessLogin(@Body() dto: VerifyTokenDto) {
    try {
      const result = await this.authService.authenticatePasswordLessLogin(
        dto.token,
      );
      return result;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot authenticate with Email');
    }
  }

  @ApiFormattedResponse({
    type: VerifyTokenResponse,
    isCreated: true,
  })
  @Post('/access-token/verify')
  async verifyAccessToken(@Body() dto: VerifyTokenDto) {
    return this.accessTokenService.verifyAccessToken(dto.token);
  }
}
