import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { EmailModule } from 'src/email/email.module';
import AccessTokenService from './access-token.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [ProxyModule, EmailModule, CommonModule],
  providers: [AuthService, AccessTokenService],
  controllers: [AuthController],
  exports: [AccessTokenService],
})
export class AuthModule {}
