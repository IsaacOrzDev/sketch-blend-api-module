import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUserDto, FindUserDto, LoginUserDto } from './user.dto';
import { UserClient } from 'src/proto/user';

@Injectable()
export class UserService {
  constructor(private dbService: DbService) {}

  private userClient: UserClient;

  public async createUser(data: CreateUserDto) {
    return this.dbService.client.user.create({
      data: {
        name: data.name,
        email: data.email,
        loginAt: new Date(),
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

  public async loginUser(data: LoginUserDto) {
    const user = await this.dbService.client.user.update({
      where: {
        id: data.id,
      },
      data: {
        loginAt: new Date(),
      },
    });

    const loginRecord = await this.dbService.client.login.findFirst({
      where: {
        userId: data.id,
        method: data.login.method,
      },
    });

    if (!loginRecord) {
      await this.dbService.client.login.create({
        data: {
          userId: data.id,
          method: data.login.method,
          data: data.login.data,
          imageUrl: data.login.imageUrl,
        },
      });
    } else {
      await this.dbService.client.login.update({
        where: {
          id: loginRecord.id,
        },
        data: {
          data: data.login.data,
          imageUrl: data.login.imageUrl,
        },
      });
    }
    return user;
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

  public async findAllUsers() {
    return this.dbService.client.user.findMany({
      include: {
        logins: true,
      },
    });
  }
}
