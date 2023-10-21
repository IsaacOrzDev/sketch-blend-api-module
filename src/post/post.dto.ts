import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, ValidateIf } from 'class-validator';

export class GetPostListDto {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform(({ value }) => {
    return Number(value);
  })
  offset?: number;
  @ApiPropertyOptional({
    type: Number,
  })
  @IsNumber()
  @ValidateIf((object, value) => value !== null && value !== undefined)
  @Transform(({ value }) => {
    return Number(value);
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

class ImageInfo {
  @ApiProperty({
    type: Number,
  })
  width: number;

  @ApiProperty({
    type: Number,
  })
  height: number;
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

  @ApiProperty({
    type: ImageInfo,
  })
  imageInfo: ImageInfo;

  @ApiProperty({
    type: UserInfo,
  })
  sourceImageInfo: ImageInfo;
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
