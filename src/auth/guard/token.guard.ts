import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import AccessTokenService from '../access-token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private accessTokenService: AccessTokenService) {}

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      if (!(await this.accessTokenService.verifyAccessToken(token)).isValid) {
        throw new UnauthorizedException();
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
