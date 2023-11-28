import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response as Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { TokenGuard } from 'src/auth/guard/token.guard';
import FormatUtils from 'src/common/format.utils';
import { AuthUser, User } from 'src/decorator/user';
import { DocumentGrpc } from 'src/proxy/document.grpc';
import {
  DeleteDocumentDto,
  GetDocumentDto,
  GetDocumentListDto,
  GetDocumentListResponse,
  GetDocumentResponse,
  SaveDocumentDto,
  SaveDocumentResponse,
  UpdateDocumentDto,
} from './document.dto';
import { ApiFormattedResponse } from 'src/decorator/api-response';
import { Response } from 'express';
import { DocumentService } from './document.service';
import { faker } from '@faker-js/faker';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@ApiTags('Documents')
@Controller('/documents')
export class DocumentController {
  constructor(
    private documentGrpc: DocumentGrpc,
    private formatUtils: FormatUtils,
    private documentService: DocumentService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: GetDocumentListResponse,
  })
  @UseGuards(TokenGuard)
  @Get('/')
  async getList(@User() user: AuthUser, @Query() dto: GetDocumentListDto) {
    const cached = await this.documentService.getCachedList({
      userId: user.userId,
      offset: dto.offset,
      limit: dto.limit,
    });

    if (cached) {
      return cached;
    }
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocumentList({
        userId: user.userId,
        offset: dto.offset,
        limit: dto.limit,
      }),
    );
    const output = {
      records: result.records
        ? result.records.map((document) => ({
            ...document,
            createdAt: this.formatUtils.formatTimestamp(document.createdAt),
            updatedAt: this.formatUtils.formatTimestamp(document.updatedAt),
          }))
        : [],
    };
    await this.documentService.setCachedList({
      userId: user.userId,
      offset: dto.offset,
      limit: dto.limit,
      data: output,
    });
    return output;
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: GetDocumentResponse,
  })
  @UseGuards(TokenGuard)
  @Get('/:id')
  async getOne(@User() user: AuthUser, @Param() params: GetDocumentDto) {
    const result = await this.documentService.checkIsUserDocument(
      user,
      params.id,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...documentData } = result.record;

    return {
      record: {
        ...documentData,
        paths: documentData.paths ? Object.values(documentData.paths) : {},
        createdAt: this.formatUtils.formatTimestamp(result.record.createdAt),
        updatedAt: this.formatUtils.formatTimestamp(result.record.updatedAt),
      },
    };
  }

  @ApiFormattedResponse({
    type: SaveDocumentResponse,
    isCreated: true,
  })
  @Get('/:id/image')
  async getImage(@Param() params: GetDocumentDto, @Res() res: Response) {
    const result = await firstValueFrom(
      this.documentGrpc.client.getDocument({
        id: params.id,
      }),
    );
    console.log(result.record.image);
    return res
      .set({ 'Content-Type': 'image/png' })
      .send(
        Buffer.from(
          result.record.image.replace('data:image/png;base64,', ''),
          'base64',
        ),
      );
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: SaveDocumentResponse,
    isCreated: true,
  })
  @UseGuards(TokenGuard)
  @Post('/create')
  async saveDocument(@User() user: AuthUser, @Body() dto: SaveDocumentDto) {
    const result = await firstValueFrom(
      this.documentGrpc.client.saveDocument({
        data: dto,
        userId: user.userId,
      }),
    );
    await this.documentService.deleteCachedList({
      userId: user.userId,
    });
    return result;
  }

  @ApiBearerAuth()
  @ApiFormattedResponse({
    type: SaveDocumentResponse,
    isCreated: true,
  })
  @UseGuards(TokenGuard)
  @Post('/create/empty')
  async saveEmptyDocument(@User() user: AuthUser) {
    await this.documentService.deleteCachedList({
      userId: user.userId,
    });
    return firstValueFrom(
      this.documentGrpc.client.saveDocument({
        data: {
          paths: [],
          title: faker.lorem.words(3),
          svg: '<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="react-sketch-canvas" style="width: 100%; height: 100%;" viewBox="0 0 2560 1117" width="2560" height="1117"><g id="react-sketch-canvas__eraser-stroke-group" display="none"><rect id="react-sketch-canvas__mask-background" x="0" y="0" width="100%" height="100%" fill="white"></rect></g><defs></defs><g id="react-sketch-canvas__canvas-background-group"><rect id="react-sketch-canvas__canvas-background" x="0" y="0" width="100%" height="100%" fill="transparent"></rect></g><g id="react-sketch-canvas__stroke-group-0" mask="url(#react-sketch-canvas__eraser-mask-0)"></g></svg>',
          image: '',
        },
        userId: user.userId,
      }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Patch('/:id')
  async updateDocument(@User() user: AuthUser, @Body() dto: UpdateDocumentDto) {
    await this.documentService.checkIsUserDocument(user, dto.id);
    await this.documentService.deleteCachedList({
      userId: user.userId,
    });
    return firstValueFrom(
      this.documentGrpc.client.updateDocument({
        data: {
          title: dto.data.title,
          ...dto.data,
        },
        id: dto.id,
      }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Delete('/:id')
  async deleteDocument(
    @User() user: AuthUser,
    @Param() dto: DeleteDocumentDto,
  ) {
    await this.documentService.checkIsUserDocument(user, dto.id);
    const keys = await this.redis.keys(`documents:userId:${user.userId}:*`);
    for (const key of keys) {
      await this.redis.del(key);
    }
    return firstValueFrom(
      this.documentGrpc.client.deleteDocument({
        id: dto.id,
      }),
    );
  }
}
