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

export class AuthenticateResponse {
  @ApiProperty({
    type: Boolean,
    default: true,
  })
  success: boolean;

  @ApiProperty({
    type: Date,
  })
  expiredAt: string;

  @ApiProperty({
    type: String,
  })
  token: string;

  @ApiProperty({
    type: Boolean,
  })
  isFirstTime: boolean;
}
