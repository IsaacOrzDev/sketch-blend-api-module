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

class UserInfo {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  imageUrl?: string;
}

class PostRecord {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  prompt: string;

  @ApiProperty({
    type: String,
  })
  imageUrl: string;

  @ApiProperty({
    type: String,
  })
  sourceImageUrl: string;

  createdAt: Date;

  updatedAt: Date;

  @ApiProperty({
    type: UserInfo,
  })
  userInfo: {
    name: string;
    imageUrl: string;
  };
}

class PostDetailRecord extends PostRecord {}

export class GetPostListResponse {
  @ApiProperty({
    type: PostRecord,
    isArray: true,
  })
  records: PostRecord[];
}

export class GetDocumentDto {
  @ApiProperty({
    type: String,
  })
  id: string;
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

export class CreatePostResponse extends PostDetailRecord {}

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
