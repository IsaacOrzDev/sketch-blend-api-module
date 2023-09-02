import { ApiProperty } from '@nestjs/swagger';

export class VerifyGoogleIdTokenDto {
  @ApiProperty({
    type: String,
  })
  token: string;
}
