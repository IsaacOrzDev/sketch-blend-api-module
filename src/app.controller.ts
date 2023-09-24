import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TokenGuard } from './auth/guard/token.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  healthCheck() {
    return true;
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/test')
  getTesting() {
    return 'testing';
  }
}
