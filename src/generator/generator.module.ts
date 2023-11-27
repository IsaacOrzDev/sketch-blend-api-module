import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from 'src/proxy/proxy.module';
import { GeneratorController } from './generator.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DocumentModule } from 'src/document/document.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProxyModule,
    AuthModule,
    DocumentModule,
    QueueModule,
  ],
  providers: [],
  controllers: [GeneratorController],
  exports: [],
})
export class GeneratorModule {}
