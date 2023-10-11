import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('/posts')
export class PostController {
  constructor() {}
}
