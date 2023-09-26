import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { VerifyAccessTokenReply } from 'src/grpc/proto/access_token';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export interface AuthUser extends Omit<VerifyAccessTokenReply, 'isValid'> {}
