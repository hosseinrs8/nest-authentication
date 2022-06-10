import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User } from './user/entities/user.entity';
import { SessionController } from './session/session.controller';
import { SessionService } from './session/session.service';
import { Session } from './session/entities/session.entity';
import { RegistrationService } from './registration/registration.service';
import jwtSetups from '../config/jwt-setup';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Session]),
    JwtModule.registerAsync(jwtSetups),
    PassportModule,
  ],
  providers: [
    AuthenticationService,
    UserService,
    SessionService,
    RegistrationService,
  ],
  controllers: [AuthenticationController, UserController, SessionController],
})
export class AuthenticationModule {}
