import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import AccessTokenService from '../auth/access-token.service';
import { GenerateTokenDto, GetImageSizeDto } from './testing.dto';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { AddOneTimeTokenDto } from 'src/auth/auth.dto';
import { DevGuard } from 'src/auth/guard/dev.guard';
import { BucketUploadDto } from 'src/bucket/bucket.dto';
import BucketService from 'src/bucket/bucket.service';
import ImageService from 'src/image/image.service';

@ApiTags('Testing')
@Controller('/testing')
export class TestingController {
  constructor(
    private accessTokenService: AccessTokenService,
    private bucketService: BucketService,
    private imageService: ImageService,
  ) {}

  @UseGuards(DevGuard)
  @Post('/access-token/generate')
  async generateAccessToken(@Body() body: GenerateTokenDto) {
    return this.accessTokenService.generateAccessToken({
      userId: `${body.userId}`,
      username: 'username',
    });
  }

  @ApiBearerAuth()
  @UseGuards(DevGuard, TokenGuard)
  @Get('/auth/test')
  getTesting() {
    return 'is authenticated';
  }

  @UseGuards(DevGuard)
  @Post('/auth/password-less/generate')
  async generatePasswordLessToken(@Body() dto: AddOneTimeTokenDto) {
    return this.accessTokenService.addOneTimeAccessToken(dto);
  }

  @UseGuards(DevGuard)
  @Post('/bucket/upload')
  async uploadFile(@Body() data: BucketUploadDto) {
    await this.bucketService.downloadAndUploadToS3(data);
    return { success: true };
  }

  @UseGuards(DevGuard)
  @Get('/image/size')
  async getImageSize(@Query() query: GetImageSizeDto) {
    return this.imageService.getImageSize(query.imageUrl);
  }
}
