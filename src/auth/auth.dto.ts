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

  @ApiProperty({
    type: String,
    nullable: true,
  })
  username?: string;
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
  expiresAtUtc: string;

  @ApiProperty({
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    type: Boolean,
  })
  isFirstTime: boolean;
}

export class VerifyTokenResponse {
  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String, nullable: true })
  email?: string;

  @ApiProperty({ type: String, nullable: true })
  imageUrl?: string;
}

export class AddOneTimeTokenDto {
  @ApiProperty({ type: String, nullable: true })
  username?: string;

  @ApiProperty({ type: String })
  email: string;
}
