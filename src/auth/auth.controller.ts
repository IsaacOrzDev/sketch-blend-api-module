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

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiFormattedResponse({
    type: AuthenticateResponse,
    isCreated: true,
    successDescription: 'Authenticate with Google',
    errorDescription: 'Cannot authenticate with Google',
  })
  @Post('/google/authenticate')
  async authenticateGoogleUser(
    @Body() dto: AuthenticateGithubUserDto,
  ): Promise<{
    success: boolean;
    token: string;
    isFirstTime: boolean;
  }> {
    try {
      const result = await this.authService.authenticateGoogleUser(dto.code);
      const token = await this.authService.generateAccessToken({
        userId: result.name,
        username: result.name,
        email: result.email,
        imageUrl: result.imageUrl,
      });
      return { success: true, ...token, isFirstTime: result.isFirstTime };
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await this.authService.authenticateGithubUser(dto.code);

      const token = await this.authService.generateAccessToken({
        userId: result.name,
        username: result.name,
        email: result.email,
        imageUrl: result.imageUrl,
      });
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
    return this.authService.generateAccessToken({
      userId: 'userId',
      username: 'username',
    });
  }

  @ApiFormattedResponse({
    type: VerifyTokenResponse,
    isCreated: true,
  })
  @Post('/access-token/verify')
  async verifyAccessToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyAccessToken(dto.token);
  }
}
