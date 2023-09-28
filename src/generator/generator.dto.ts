import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PredictDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  prompt: string;
}

export class PredictResponse {
  @ApiProperty({
    type: String,
    isArray: true,
  })
  urls: string[];
}

export class PredictParam {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  documentId: string;
}

export class ScribblePredictBody {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  prompt: string;
}

export class ScribblePredictResponse {
  @ApiProperty({
    type: String,
  })
  url: string;
}
