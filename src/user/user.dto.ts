import { LoginMethod } from 'prisma/prisma-client';

export class CreateUserDto {
  name: string;
  email?: string;
  login: {
    method: LoginMethod;
    data?: any;
    imageUrl?: string;
  };
}

export class LoginUserDto {
  id: string;
  login: {
    method: LoginMethod;
    data?: any;
    imageUrl?: string;
  };
}

export class FindUserDto {
  name?: string;
  email?: string;
  method?: LoginMethod;
}
