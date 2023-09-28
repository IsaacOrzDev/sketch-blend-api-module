import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from 'src/proxy/proxy.module';
import { GeneratorController } from './generator.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DocumentModule } from 'src/document/document.module';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule, AuthModule, DocumentModule],
  providers: [],
  controllers: [GeneratorController],
  exports: [],
})
export class GeneratorModule {}
