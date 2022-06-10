import {
  Body,
  Controller,
  UnauthorizedException,
  Headers,
  Post,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuspiciousDevice } from '../exceptions/suspicious-device';
import { AuthenticationRefreshTokenStatus, JWTPayload } from '../interfaces';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RealIP } from '../decorators/real-ip.decorator';
import { Public } from '../decorators/public.decorator';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { decode as JWTDecode } from 'jsonwebtoken';
import { SessionFindAdvanceDto } from './dto/session-find-advance.dto';

@ApiTags('Session')
@Controller('session')
export class SessionController {
  private readonly allowSuspiciousTokens: boolean = true;

  constructor(private readonly sessionService: SessionService) {}

  @ApiBearerAuth()
  @Get()
  findAll(@Query('page') page = '0'): Promise<Array<Session>> {
    return this.sessionService.findAdvance({ id: { $gt: 0 } }, 15, +page * 15);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Session> {
    return this.sessionService.findOne(+id);
  }

  @ApiBearerAuth()
  @Post('find-advance')
  findAdvance(
    @Body() findAdvanceDto: SessionFindAdvanceDto,
    @Query('page') page = '0',
  ): Promise<Array<Session>> {
    return this.sessionService.findAdvance(findAdvanceDto, 15, +page * 15);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Session> {
    return this.sessionService.revoke(+id);
  }

  @Public()
  @Post()
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Headers('user-agent') userAgent: string,
    @RealIP() ip: string,
  ): Promise<RefreshTokenDto> {
    const jwtPayload = JWTDecode(refreshTokenDto.accessToken) as JWTPayload;
    const token = jwtPayload.sub;
    const { status, tokenEntity } = await this.sessionService.checkRefreshToken(
      token,
      refreshTokenDto.refreshToken,
      ip,
      userAgent,
    );
    if (status !== AuthenticationRefreshTokenStatus.ok) {
      if (
        status === AuthenticationRefreshTokenStatus.suspiciousDevice ||
        status === AuthenticationRefreshTokenStatus.suspiciousIP
      ) {
        this.sessionService.fireSuspiciousRequestEvent(token, ip, userAgent);
        if (!this.allowSuspiciousTokens) {
          await this.sessionService.revoke(tokenEntity.id);
          throw new SuspiciousDevice();
        }
      } else {
        throw new UnauthorizedException();
      }
    } else
      return this.sessionService.refreshAuthenticationToken(
        tokenEntity || token,
      );
  }
}
