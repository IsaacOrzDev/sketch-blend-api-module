import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { GeneratorGrpc } from 'src/proxy/generator.grpc';
import { PredictDto, PredictResponse } from './generator.dto';
import { ApiFormattedResponse } from 'src/decorator/api-response';
import { firstValueFrom } from 'rxjs';

@ApiTags('Generator')
@Controller('/generator')
export class GeneratorController {
  constructor(private generatorGrpc: GeneratorGrpc) {}

  @ApiFormattedResponse({
    type: PredictResponse,
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/predict')
  predict(@Query() dto: PredictDto) {
    return firstValueFrom(
      this.generatorGrpc.client.predict({
        prompt: dto.prompt,
      }),
    );
  }
}
