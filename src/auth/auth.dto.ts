import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({
    type: String,
  })
  token: string;
}

export class SendEmailForPasswordLessDto {
  @ApiProperty({
    type: String,
  })
  email: string;
}
