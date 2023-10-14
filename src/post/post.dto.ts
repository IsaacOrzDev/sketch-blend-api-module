import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetPostListDto {
  @ApiPropertyOptional({
    type: Number,
  })
  offset?: number;
  @ApiPropertyOptional({
    type: Number,
  })
  limit?: number;
}

export class CreatePostDto {
  @ApiProperty({
    type: String,
  })
  prompt: string;

  @ApiProperty({
    type: String,
  })
  documentId: string;

  @ApiProperty({
    type: String,
  })
  imageUrl: string;
}

export class DeletePostDto {
  @ApiProperty({
    type: String,
  })
  id: string;
}

export class LikePostDto {
  @ApiProperty({
    type: String,
  })
  id: string;
}
