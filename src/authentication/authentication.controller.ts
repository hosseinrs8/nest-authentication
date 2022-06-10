import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { Public } from './decorators/public.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { RealIP } from './decorators/real-ip.decorator';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SessionService } from './session/session.service';
import { AuthenticationMode } from './interfaces';
import { RegistrationService } from './registration/registration.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedUserId } from './decorators/authenticated-user-id.decorator';
import { DeviceTokenId } from './decorators/device-token-id.decorator';
import { GetProfileResponseDto } from './dto/get-profile-response.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly authenticationService: AuthenticationService,
    private readonly sessionService: SessionService,
    private readonly registrationService: RegistrationService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterUserDto): Promise<User> {
    return this.registrationService.registerUser(dto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Headers('user-agent') userAgent: string,
    @RealIP() ip: string,
    @Body() dto: LoginUserDto,
  ) {
    const user = await this.userRepository.findOne({ email: dto.username });
    if (!user) await this.userRepository.findOne({ phone: dto.username });
    if (user) {
      const { token, refreshToken } = await this.sessionService.create(
        user,
        ip,
        userAgent,
        dto.mode,
      );
      return this.authenticationService.login(user.id, token).then((res) => {
        if (dto.mode !== AuthenticationMode.safeMode) return res;
        return { ...res, refreshToken };
      });
    }
  }

  @ApiBearerAuth()
  @Get('current')
  async getProfile(
    @AuthenticatedUserId() userId: number,
    @DeviceTokenId() tokenId: number,
  ): Promise<GetProfileResponseDto> {
    return this.authenticationService.getProfile(userId, tokenId);
  }
}
