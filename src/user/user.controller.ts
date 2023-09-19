// controller to get users data

import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from 'src/auth/guard/token.guard';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('/')
  public async findAllUsers() {
    return this.userService.findAllUsers();
  }

  // testing
  @Post('/')
  public async createUser() {
    return this.userService.createUserByGrpc();
  }
}
