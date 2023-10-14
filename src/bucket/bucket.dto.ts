import { ApiProperty } from '@nestjs/swagger';

export class BucketUploadDto {
  @ApiProperty({ type: 'string' })
  url: string;

  @ApiProperty({ type: 'string' })
  fileName: string;
}

export class BucketUploadBase64Dto {
  @ApiProperty({ type: 'string' })
  base64: string;

  @ApiProperty({ type: 'string' })
  fileName: string;
}
