import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class DevGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const request = context.switchToHttp().getRequest();

      if (
        !request.headers.referer.includes('http://localhost') ||
        !request.headers.origin.includes('http://localhost')
      ) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
