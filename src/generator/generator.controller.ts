import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guard/token.guard';

@ApiTags('Generator')
@Controller('/generator')
export class GeneratorController {
  constructor() {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/predict')
  predict() {
    return '';
  }
}
