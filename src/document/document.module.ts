import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from 'src/proxy/proxy.module';
import { DocumentController } from './document.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule, AuthModule],
  providers: [],
  controllers: [DocumentController],
  exports: [],
})
export class DocumentModule {}
