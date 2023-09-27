import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  SaveDocumentData,
  SaveDocumentReply,
  Document,
} from 'src/grpc/proto/document';

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

class DocumentDto
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

class DocumentDetailDto extends DocumentDto {
  @ApiProperty({
    type: Object,
    nullable: true,
  })
  paths?: { [key: string]: any };
}

export class GetDocumentListResponse {
  @ApiProperty({
    type: DocumentDto,
    isArray: true,
  })
  records: DocumentDto[];
}

export class GetDocumentDto {
  @ApiProperty({
    type: String,
  })
  id: string;
}

export class GetDocumentResponse {
  @ApiProperty({
    type: DocumentDetailDto,
  })
  record: DocumentDetailDto;
}
