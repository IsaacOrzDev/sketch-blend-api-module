import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';
import { DbModule } from 'src/db/db.module';
import AccessTokenService from './access-token.service';

@Module({
  imports: [ProxyModule, EmailModule, forwardRef(() => UserModule), DbModule],
  providers: [AuthService, AccessTokenService],
  controllers: [AuthController],
  exports: [AccessTokenService],
})
export class AuthModule {}
