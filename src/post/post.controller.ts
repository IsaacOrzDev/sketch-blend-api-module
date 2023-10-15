import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import {
  CreatePostDto,
  DeletePostDto,
  GetPostListDto,
  LikePostDto,
} from './post.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { AuthUser, User } from 'src/decorator/user';

@ApiTags('Post')
@Controller('/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/')
  async getList(@Query() dto: GetPostListDto) {
    return this.postService.getPosts(dto);
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('/create')
  async create(@User() user: AuthUser, @Body() data: CreatePostDto) {
    const result = await this.postService.createPost(data, user.userId);
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Delete('/:id')
  async delete(@User() user: AuthUser, @Param() data: DeletePostDto) {
    await this.postService.checkIsUserPost(user, data.id);
    await this.postService.deletePost(data);
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('/:id/like')
  async like(@User() user: AuthUser, @Param() data: LikePostDto) {
    await this.postService.likePost(data, user.userId);
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('/:id/unlike')
  async unlike(@User() user: AuthUser, @Param() data: LikePostDto) {
    await this.postService.unlikePost(data, user.userId);
    return { success: true };
  }
}
