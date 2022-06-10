import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getIP } from '../decorators/real-ip.decorator';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../session/session.service';
import { AuthenticationTokenStatus, JWTPayload } from '../interfaces';
import { SuspiciousDevice } from '../exceptions/suspicious-device';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly allowSuspiciousTokens: boolean;

  constructor(
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: readFileSync(
        configService.get<string>('authentication.jwt.publicKeyPath'),
      ),
    });
    this.allowSuspiciousTokens = this.configService.get<boolean>(
      'authentication.allowSuspiciousTokens',
    );
  }

  async validate(request: any, payload: JWTPayload) {
    const token = payload.sub;
    const userId = payload.userId;
    const clientIP = getIP(request);
    const clientUserAgent = request.headers['user-agent'];
    const { status, tokenEntity } = await this.sessionService.checkToken(
      token,
      userId,
      clientIP,
      clientUserAgent,
    );
    if (status !== AuthenticationTokenStatus.ok) {
      if (
        status === AuthenticationTokenStatus.suspiciousDevice ||
        status === AuthenticationTokenStatus.suspiciousIP
      ) {
        this.sessionService.fireSuspiciousRequestEvent(
          token,
          clientIP,
          clientUserAgent,
        );
        if (!this.allowSuspiciousTokens) {
          await this.sessionService.revoke(tokenEntity.id);
          throw new SuspiciousDevice();
        }
      } else {
        throw new UnauthorizedException();
      }
    }
    this.sessionService
      .updateTokenUsage(tokenEntity || token, clientIP, clientUserAgent)
      .then();
    return {
      id: userId,
      tokenId: tokenEntity?.id,
    };
  }
}
