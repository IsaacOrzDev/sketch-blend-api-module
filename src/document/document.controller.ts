import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { TokenGuard } from 'src/auth/guard/token.guard';
import FormatUtils from 'src/common/format.utils';
import { AuthUser, User } from 'src/decorator/user';
import { DocumentGrpc } from 'src/proxy/document.grpc';
import { SaveDocumentDto, SaveDocumentResponse } from './document.dto';
import { ApiFormattedResponse } from 'src/decorator/api-response';

@ApiTags('Documents')
@Controller('/documents')
export class DocumentController {
  constructor(
    private documentGrpc: DocumentGrpc,
    private formatUtils: FormatUtils,
  ) {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/')
  async getList() {
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocumentList({
        page: 0,
        size: 10,
      }),
    );
    return result.documents.map((document) => ({
      ...document,
      createdAt: this.formatUtils.formatTimestamp(document.createdAt),
      updatedAt: this.formatUtils.formatTimestamp(document.updatedAt),
    }));
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/:id')
  async getOne() {
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: 'id',
      }),
    );
    return {
      ...result.document,
      createdAt: this.formatUtils.formatTimestamp(result.document.createdAt),
      updatedAt: this.formatUtils.formatTimestamp(result.document.updatedAt),
    };
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: SaveDocumentResponse,
    isCreated: true,
  })
  @UseGuards(TokenGuard)
  @Post('/')
  saveDocument(@User() user: AuthUser, @Body() dto: SaveDocumentDto) {
    console.log('user', user);
    return firstValueFrom(
      this.documentGrpc.client.saveDocument({
        document: {
          ...dto,
        },
      }),
    );
  }
}
