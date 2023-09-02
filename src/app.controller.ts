import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TokenGuard } from './auth/guard/token.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get()
  getTesting() {
    return this.appService.getTesting();
  }
}
