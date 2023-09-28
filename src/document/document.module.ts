import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from 'src/proxy/proxy.module';
import { DocumentController } from './document.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { DocumentService } from './document.service';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule, AuthModule, CommonModule],
  providers: [DocumentService],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
