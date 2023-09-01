import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('SUB_SERVICE') private client: ClientProxy) {}

  async getTesting() {
    const data = await firstValueFrom(
      this.client.send('testing', { id: undefined }),
    );
    return data;
  }
}
