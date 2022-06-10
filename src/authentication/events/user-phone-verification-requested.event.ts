import { User } from '../user/entities/user.entity';

export class UserPhoneVerificationRequestedEvent {
  constructor(public user: User) {}
}
