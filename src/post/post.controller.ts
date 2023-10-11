import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('/posts')
export class PostController {
  constructor() {}

  @Get('/')
  async getList() {}
}
