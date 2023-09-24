import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from 'src/proxy/proxy.module';
import { GeneratorController } from './generator.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule, AuthModule],
  providers: [],
  controllers: [GeneratorController],
  exports: [],
})
export class GeneratorModule {}
