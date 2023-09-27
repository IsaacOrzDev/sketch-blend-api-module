import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
  async getList(@User() user: AuthUser) {
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocumentList({
        userId: user.userId,
        offset: 0,
        limit: 10,
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
  async getOne(@User() user: AuthUser) {
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: 'id',
      }),
    );
    if (result.document.userId !== user.userId) {
      throw new Error('Not allowed');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...documentData } = result.document;

    return {
      ...documentData,
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
    return firstValueFrom(
      this.documentGrpc.client.saveDocument({
        document: dto,
        userId: user.userId,
      }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Patch('/:id')
  async updateDocument(@User() user: AuthUser, @Body() dto: { id: string }) {
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: dto.id,
      }),
    );

    if (result.document.userId !== user.userId) {
      throw new Error('Not allowed');
    }

    // return firstValueFrom(
    //   this.documentGrpc.client.updateDocument({
    //     document: dto,
    //     userId: user.userId,
    //   }),
    // );
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Delete('/:id')
  async deleteDocument(@User() user: AuthUser, @Body() dto: { id: string }) {
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: dto.id,
      }),
    );

    if (result.document.userId !== user.userId) {
      throw new Error('Not allowed');
    }

    // return firstValueFrom(
    //   this.documentGrpc.client.deleteDocument({
    //     document: dto,
    //     userId: user.userId,
    //   }),
    // );
  }
}
