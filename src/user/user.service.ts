import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { AddUserInfoDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  public async addUserInfo(data: AddUserInfoDto) {
    await this.prismaService.client.userInfo.create({
      data: {
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
        userId: data.userId,
      },
    });
  }
}
