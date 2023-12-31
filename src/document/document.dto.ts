import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import {
  SaveDocumentData,
  SaveDocumentReply,
  Document,
} from 'src/grpc/proto/document';

export class GetDocumentListDto {
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

export class SaveDocumentDto implements SaveDocumentData {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  svg?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  image?: string;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  paths?: { [key: string]: any };
}

export class SaveDocumentResponse implements SaveDocumentReply {
  @ApiProperty({
    type: String,
  })
  id: string;
}

class DocumentRecord
  implements Omit<Document, 'userId' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  svg?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  image?: string;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  paths?: { [key: string]: any };

  createdAt: Date;

  updatedAt: Date;
}

class DocumentDetailRecord extends DocumentRecord {
  @ApiProperty({
    type: Object,
    nullable: true,
  })
  paths?: { [key: string]: any };
}

export class GetDocumentListResponse {
  @ApiProperty({
    type: DocumentRecord,
    isArray: true,
  })
  records: DocumentRecord[];
}

export class GetDocumentDto {
  @ApiProperty({
    type: String,
  })
  id: string;
}

export class GetDocumentResponse {
  @ApiProperty({
    type: DocumentDetailRecord,
  })
  record: DocumentDetailRecord;
}

export class UpdateDocumentDataDto {
  @ApiProperty({
    type: String,
    nullable: true,
  })
  title?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  svg?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  image?: string;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  paths?: { [key: string]: any };
}

export class UpdateDocumentDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: SaveDocumentDto,
  })
  data: UpdateDocumentDataDto;
}

export class DeleteDocumentDto {
  @ApiProperty({
    type: String,
  })
  id: string;
}
