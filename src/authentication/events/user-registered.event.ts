import { User } from '../user/entities/user.entity';

export class UserRegisteredEvent {
  constructor(public user: User) {}
}
