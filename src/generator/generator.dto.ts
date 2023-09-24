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
