import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import FormatUtils from './format.utils';

@Module({
  imports: [ConfigModule.forRoot(), CommonModule],
  providers: [FormatUtils],
  controllers: [],
  exports: [FormatUtils],
})
export class CommonModule {}
