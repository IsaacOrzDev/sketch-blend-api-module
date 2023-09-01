import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTesting(): string {
    return 'testing';
  }
}
