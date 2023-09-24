import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from './proxy/proxy.module';
import { AuthModule } from './auth/auth.module';
import { GeneratorModule } from './generator/generator.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProxyModule,
    AuthModule,
    GeneratorModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
