import { Body, Controller, Post } from '@nestjs/common';
import BucketService from './bucket.service';
import { BucketUploadDto } from './bucket.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bucket')
@Controller('/bucket')
export class BucketController {
  constructor(private bucketService: BucketService) {}

  // @ApiFormattedResponse({
  //   type: ,
  //   isCreated: true,
  //   successDescription: 'Authenticate with Google',
  //   errorDescription: 'Cannot authenticate with Google',
  // })
  @Post('/upload')
  async uploadFile(@Body() data: BucketUploadDto) {
    await this.bucketService.downloadAndUploadToS3(data);
    return { success: true };
  }
}
