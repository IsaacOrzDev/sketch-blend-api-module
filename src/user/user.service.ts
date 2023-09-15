import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto, FindUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private dbService: DbService) {}

  public async createUser(data: CreateUserDto) {
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

  public async findUser(data: FindUserDto) {
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
