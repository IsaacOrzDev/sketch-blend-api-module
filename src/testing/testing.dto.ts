import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenDto {
  @ApiProperty({ type: Number })
  userId: number;
}

export class GetImageSizeDto {
  @ApiProperty({ type: String })
  imageUrl: string;
}
