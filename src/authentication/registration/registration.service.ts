import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import * as zxcvbn from 'zxcvbn';
import { RegistrationConfig } from '../../config/types';
import { UserService } from '../user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { UserPhoneVerificationRequestedEvent } from '../events/user-phone-verification-requested.event';
import { UserEmailVerificationRequestedEvent } from '../events/user-email-verification-requested.event';

@Injectable()
export class RegistrationService {
  protected config: RegistrationConfig;

  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    configService: ConfigService,
  ) {
    this.config = configService.get<RegistrationConfig>('registration');
  }

  public async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { phone, email } = registerUserDto;
    this.checkPassword(registerUserDto);
    this.checkRequiredContactInfo(registerUserDto);
    await this.userService.checkInfoToBeUnique(phone, email);
    const user = await this.userService.create(registerUserDto);
    this.fireVerifyContactInfoEvents(user);
    return user;
  }

  protected checkRequiredContactInfo(registerUserDto: RegisterUserDto) {
    if (this.config.requiredEmail) {
      if (!registerUserDto.email || registerUserDto.email.length === 0) {
        throw new BadRequestException('email should be defined');
      }
    }
    if (this.config.requiredPhone) {
      if (!registerUserDto.phone || registerUserDto.phone.length === 0) {
        throw new BadRequestException('phone should be defined');
      }
    }
  }

  protected fireVerifyContactInfoEvents(user: User) {
    if (this.config.autoVerifyEmail) {
      this.eventEmitter.emit(
        'user.verification.email.requested',
        new UserEmailVerificationRequestedEvent(user),
      );
    }
    if (this.config.autoVerifyPhone) {
      this.eventEmitter.emit(
        'user.verification.phone.requested',
        new UserPhoneVerificationRequestedEvent(user),
      );
    }
  }

  protected isPasswordSecure(password: string) {
    const { score } = zxcvbn(password);
    return score >= this.config.minimumAcceptablePasswordScore;
  }

  protected checkPassword(registerUserDto: RegisterUserDto) {
    if (!this.isPasswordSecure(registerUserDto.password)) {
      throw new BadRequestException('password is not strong enough');
    }
  }
}
