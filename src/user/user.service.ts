import { Injectable } from '@nestjs/common';
import { UserGrpc } from 'src/proxy/user.grpc';

@Injectable()
export class UserService {
  constructor(private userGrpc: UserGrpc) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getUsers(params: { ids: number[] }) {
    return this.userGrpc.client.findUser({
      email: '',
    });
  }
}
