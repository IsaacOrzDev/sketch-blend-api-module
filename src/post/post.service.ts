import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}
}
