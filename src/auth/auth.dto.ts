import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({
    type: String,
  })
  token: string;
  @ApiProperty({
    type: Boolean,
    nullable: true,
  })
  withAccessToken?: boolean;
}

export class verifyPasswordLessToken {
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
