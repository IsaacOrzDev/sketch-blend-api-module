import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProxyModule } from 'src/proxy/proxy.module';
import { EmailModule } from 'src/email/email.module';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [ProxyModule, EmailModule],
  providers: [AuthService, SupabaseService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
