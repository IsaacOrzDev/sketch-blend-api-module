import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  token: string;
}

export class AuthenticateGithubUserDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  code: string;
}

export class SendEmailForPasswordLessDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  email: string;
}
