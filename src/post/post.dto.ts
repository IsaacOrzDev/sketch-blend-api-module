import { ApiProperty } from '@nestjs/swagger';

export class GetPostListDto {
  @ApiProperty({
    type: Number,
    nullable: true,
  })
  offset?: number;
  @ApiProperty({
    type: Number,
    nullable: true,
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
  sourceImageUrl: string;

  @ApiProperty({
    type: String,
  })
  imageUrl: string;
}

export class DeletePostDto {
  @ApiProperty({
    type: String,
  })
  postId: string;
}
