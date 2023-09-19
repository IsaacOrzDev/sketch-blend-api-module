// controller to get users data

import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guard/token.guard';
import { GrpcForwardService } from 'src/proxy/grpc-forward.service';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(
    private userService: UserService,
    private grpcService: GrpcForwardService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/')
  public async findAllUsers() {
    return this.userService.findAllUsers();
  }

  // testing
  @Post('/')
  public async createUser() {
    return this.grpcService.userClient.createUser({
      name: 'test',
      email: 'testing@gmail.com',
    });
  }
}
