import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueService } from './queue.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [QueueService],
  controllers: [],
  exports: [QueueService],
})
export class QueueModule {}
