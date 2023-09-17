import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService {
  public client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({
      log:
        process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    this.client.$use(async (params, next) => {
      if (params.action === 'create') {
        params.args.data.createdAt = new Date();
        params.args.data.updatedAt = new Date();
      } else if (params.action === 'update') {
        params.args.data.updatedAt = new Date();
      }
      return next(params);
    });
  }
}
