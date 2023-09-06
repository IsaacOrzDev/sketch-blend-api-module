import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [ProxyModule, EmailModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
