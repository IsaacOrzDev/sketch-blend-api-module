import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { DocumentGrpc } from 'src/proxy/document.grpc';

@ApiTags('Documents')
@Controller('/documents')
export class DocumentController {
  constructor(private documentGrpc: DocumentGrpc) {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/')
  predict() {
    return this.documentGrpc.client.getDocumentList({
      page: 0,
      size: 10,
    });
  }
}
