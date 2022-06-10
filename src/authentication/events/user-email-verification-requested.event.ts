import { User } from '../user/entities/user.entity';

export class UserEmailVerificationRequestedEvent {
  constructor(public user: User) {}
}
