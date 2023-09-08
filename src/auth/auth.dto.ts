import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({
    type: String,
  })
  token: string;
}

export class AuthenticateGithubUserDto {
  @ApiProperty({
    type: String,
  })
  code: string;
}

export class SendEmailForPasswordLessDto {
  @ApiProperty({
    type: String,
  })
  email: string;
}
