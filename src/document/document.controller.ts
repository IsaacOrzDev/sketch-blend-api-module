import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guard/token.guard';

@ApiTags('Documents')
@Controller('/documents')
export class DocumentController {
  constructor() {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/')
  predict() {
    return '';
  }
}
