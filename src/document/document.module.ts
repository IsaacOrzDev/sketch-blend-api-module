import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from 'src/proxy/proxy.module';
import { DocumentController } from './document.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule, AuthModule, CommonModule],
  providers: [],
  controllers: [DocumentController],
  exports: [],
})
export class DocumentModule {}
