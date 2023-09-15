import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto, createUserDtoSchema } from './user.type';

@Injectable()
export class UserService {
  constructor(private dbService: DbService) {}

  public async createUser(data: CreateUserDto) {
    createUserDtoSchema.parse(data);

    return this.dbService.client.user.create({
      data: {
        name: data.name,
        email: data.email,
        logins: {
          create: {
            method: data.login.method,
            data: data.login.data,
            imageUrl: data.login.imageUrl,
          },
        },
      },
    });
  }

  public async findUser(data: any) {
    return this.dbService.client.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            name: data.name,
            logins: {
              some: {
                method: data.method,
              },
            },
          },
        ],
      },
      include: {
        logins: true,
      },
    });
  }
}
