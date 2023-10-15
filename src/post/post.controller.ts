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
  CreatePostResponse,
  DeletePostDto,
  GetPostListDto,
  GetPostListResponse,
  LikePostDto,
} from './post.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { AuthUser, User } from 'src/decorator/user';
import { ApiFormattedResponse } from 'src/decorator/api-response';

@ApiTags('Post')
@Controller('/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiFormattedResponse({
    type: GetPostListResponse,
  })
  @Get('/')
  async getList(@Query() dto: GetPostListDto) {
    return this.postService.getPosts(dto);
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: CreatePostResponse,
    isCreated: true,
  })
  @UseGuards(TokenGuard)
  @Post('/create')
  async create(@User() user: AuthUser, @Body() data: CreatePostDto) {
    const result = await this.postService.createPost(data, user.userId);
    return result;
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: {},
  })
  @UseGuards(TokenGuard)
  @Delete('/:id')
  async delete(@User() user: AuthUser, @Param() data: DeletePostDto) {
    await this.postService.checkIsUserPost(user, data.id);
    await this.postService.deletePost(data);
    return { success: true };
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: {},
  })
  @UseGuards(TokenGuard)
  @Post('/:id/like')
  async like(@User() user: AuthUser, @Param() data: LikePostDto) {
    await this.postService.likePost(data, user.userId);
    return { success: true };
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: {},
  })
  @UseGuards(TokenGuard)
  @Post('/:id/unlike')
  async unlike(@User() user: AuthUser, @Param() data: LikePostDto) {
    await this.postService.unlikePost(data, user.userId);
    return { success: true };
  }
}
