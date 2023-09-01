import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';

@Resolver()
export class UserResolver {
  constructor() {}

  @Query(() => [User])
  public async userList() {
    return [{ name: 'name', id: 'id' }];
  }

  @Query(() => User, { nullable: true })
  public async user() {
    return { name: 'name', id: 'id' };
  }
}
