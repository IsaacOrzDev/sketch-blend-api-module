import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SaveDocumentData, SaveDocumentReply } from 'src/grpc/proto/document';

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
