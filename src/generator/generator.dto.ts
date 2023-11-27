import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PredictDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    type: String,
  })
  imageUrl: string;
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

export class ScribblePredictInBackgroundResponse {
  @ApiProperty({
    type: String,
  })
  id: string;
}

export class ScribblePredictStatusParam {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  taskId: string;
}

export class ScribblePredictStatusResponse {
  @ApiProperty({
    type: String,
  })
  status: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  url: string;
}
