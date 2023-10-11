import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  public client: PrismaClient;

  async onModuleInit() {
    this.client = new PrismaClient();
  }
}
