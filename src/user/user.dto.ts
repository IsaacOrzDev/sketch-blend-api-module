import { IsNotEmpty } from 'class-validator';

export class AddUserInfoDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  name: string;

  email?: string;

  imageUrl?: string;
}
