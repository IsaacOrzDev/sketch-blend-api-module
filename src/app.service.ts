import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  async getTesting() {
    try {
      return 'testing1';
    } catch (err) {
      console.log('err', err);
    }
    return '';
  }
}
