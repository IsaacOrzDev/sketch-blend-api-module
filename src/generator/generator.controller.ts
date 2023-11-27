import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { GeneratorGrpc } from 'src/proxy/generator.grpc';
import {
  PredictDto,
  PredictParam,
  PredictResponse,
  ScribblePredictBody,
  ScribblePredictInBackgroundResponse,
  ScribblePredictResponse,
  ScribblePredictStatusParam,
  ScribblePredictStatusResponse,
} from './generator.dto';
import { ApiFormattedResponse } from 'src/decorator/api-response';
import { firstValueFrom } from 'rxjs';
import { DocumentService } from 'src/document/document.service';
import { AuthUser, User } from 'src/decorator/user';
import { QueueService } from 'src/queue/queue.service';

@ApiTags('Generator')
@Controller('/generator')
export class GeneratorController {
  constructor(
    private generatorGrpc: GeneratorGrpc,
    private documentService: DocumentService,
    private queueService: QueueService,
  ) {}

  @ApiFormattedResponse({
    type: PredictResponse,
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/predict')
  predict(@Query() dto: PredictDto) {
    return firstValueFrom(
      this.generatorGrpc.client.scribblePredict({
        prompt: dto.prompt,
        imageUrl: dto.imageUrl,
      }),
    );
  }

  @ApiFormattedResponse({
    type: ScribblePredictResponse,
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('/predict/:documentId/scribble')
  async scribblePredict(
    @User() user: AuthUser,
    @Param() param: PredictParam,
    @Body() body: ScribblePredictBody,
  ) {
    await this.documentService.checkIsUserDocument(user, param.documentId);

    return firstValueFrom(
      this.generatorGrpc.client.scribblePredict({
        prompt: body.prompt,
        imageUrl: `${process.env.API_URL}/documents/${param.documentId}/image`,
      }),
    );
  }

  @ApiFormattedResponse({
    type: ScribblePredictInBackgroundResponse,
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('/predict/:documentId/scribble-background')
  async scribblePredictInBackground(
    @User() user: AuthUser,
    @Param() param: PredictParam,
    @Body() body: ScribblePredictBody,
  ) {
    await this.documentService.checkIsUserDocument(user, param.documentId);

    return firstValueFrom(
      this.generatorGrpc.client.scribblePredictInBackground({
        prompt: body.prompt,
        imageUrl: `${process.env.API_URL}/documents/${param.documentId}/image`,
      }),
    );
  }

  @ApiFormattedResponse({
    type: ScribblePredictStatusResponse,
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('/predict/status/:taskId')
  async scribblePredictStatus(@Param() param: ScribblePredictStatusParam) {
    return firstValueFrom(
      this.generatorGrpc.client.scribblePredictStatus({
        id: param.taskId,
      }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Post('/predict/:documentId/caption')
  async CaptionPredict(@User() user: AuthUser, @Param() param: PredictParam) {
    await this.documentService.checkIsUserDocument(user, param.documentId);

    return firstValueFrom(
      this.generatorGrpc.client.captionPredict({
        imageUrl: `${process.env.API_URL}/documents/${param.documentId}/image`,
      }),
    );
  }
}
