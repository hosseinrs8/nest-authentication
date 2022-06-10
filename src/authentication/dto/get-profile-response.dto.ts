import { Session } from '../session/entities/session.entity';
import { User } from '../user/entities/user.entity';

export class GetProfileResponseDto {
  user: User;

  session: Session;
}
