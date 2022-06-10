import { Injectable, NotFoundException } from '@nestjs/common';
import { REFRESH_TOKEN_SIZE, Session } from './entities/session.entity';
import { FilterQuery, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../authentication.service';
import { CryptoService } from '../../crypto/crypto.service';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import * as UserAgentParser from 'ua-parser-js';
import { lookup as ipLookup } from 'geoip-country';
import {
  AuthenticationMode,
  AuthenticationRefreshTokenStatus,
  AuthenticationTokenStatus,
} from '../interfaces';
import { RequestSuspicious } from '../events/request-suspicious';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: EntityRepository<Session>,
    private cryptoService: CryptoService,
    private eventEmitter: EventEmitter2,
    private authenticationService: AuthenticationService,
    private configService: ConfigService,
    private readonly orm: MikroORM,
  ) {}

  @UseRequestContext()
  async create(
    user: User,
    ip: string,
    userAgent: string,
    mode: AuthenticationMode = AuthenticationMode.normal,
  ) {
    const refreshToken =
      this.cryptoService.generateRandomString(REFRESH_TOKEN_SIZE);
    const token = this.cryptoService.generateUUID();
    const tokenEntity = new Session();
    tokenEntity.token = token;
    tokenEntity.user = user;
    tokenEntity.ip = ip;
    tokenEntity.userAgent = userAgent;
    tokenEntity.refreshToken = this.cryptoService.hash(refreshToken);
    tokenEntity.lastUsage = new Date();
    tokenEntity.mode = mode;
    await this.sessionRepository.persistAndFlush(tokenEntity);
    return { tokenEntity, token, refreshToken };
  }

  @UseRequestContext()
  findAll() {
    return this.sessionRepository.find({ revokedAt: null });
  }

  @UseRequestContext()
  findOne(id: number) {
    return this.sessionRepository.findOne({ id });
  }

  @UseRequestContext()
  findAdvance(
    where: FilterQuery<Session>,
    take: number | null = 15,
    skip = 0,
  ): Promise<Array<Session>> {
    return this.sessionRepository.find(where, { limit: take, offset: skip });
  }

  @UseRequestContext()
  async revoke(id: number) {
    const device = await this.findOne(id);
    device.revokedAt = new Date();
    return device;
  }

  @UseRequestContext()
  getDevice(token: string | Session): Promise<Session> {
    return typeof token === 'string'
      ? this.sessionRepository
          .findOneOrFail({
            token,
          })
          .catch((e) => {
            throw new NotFoundException('Authentication Token Not Found!');
          })
      : Promise.resolve(token);
  }

  @UseRequestContext()
  async checkToken(
    token: string,
    userId: number,
    ip: string,
    userAgent: string,
  ): Promise<{
    status: AuthenticationTokenStatus;
    tokenEntity: Session | undefined;
  }> {
    const tokenEntity = await this.sessionRepository.findOne({ token });
    if (tokenEntity) {
      if (tokenEntity.userId === userId) {
        if (!tokenEntity.isRevoked) {
          const ua = new UserAgentParser(userAgent);
          if (
            tokenEntity.userAgent === userAgent ||
            (tokenEntity.userAgentBrowser === ua.getBrowser().name &&
              tokenEntity.userAgentOS === ua.getOS().name)
          ) {
            if (
              tokenEntity.ip === ip ||
              ipLookup(ip)?.country === tokenEntity.ipCountryCode
            ) {
              return { status: AuthenticationTokenStatus.ok, tokenEntity };
            } else
              return {
                status: AuthenticationTokenStatus.suspiciousIP,
                tokenEntity,
              };
          } else
            return {
              status: AuthenticationTokenStatus.suspiciousDevice,
              tokenEntity,
            };
        } else
          return { status: AuthenticationTokenStatus.revoked, tokenEntity };
      } else
        return {
          status: AuthenticationTokenStatus.ownershipMismatch,
          tokenEntity,
        };
    } else return { status: AuthenticationTokenStatus.notFound, tokenEntity };
  }

  @UseRequestContext()
  async checkRefreshToken(
    token: string,
    refreshToken: string,
    ip: string,
    userAgent: string,
  ): Promise<{
    status: AuthenticationRefreshTokenStatus;
    tokenEntity: Session | undefined;
  }> {
    const tokenEntity = await this.sessionRepository.findOne({
      token,
    });
    if (tokenEntity) {
      if (tokenEntity.refreshToken) {
        if (!tokenEntity.isRevoked) {
          const code = this.cryptoService.hash(refreshToken);
          if (code === tokenEntity.refreshToken) {
            const ua = new UserAgentParser(userAgent);
            if (
              tokenEntity.userAgent === userAgent ||
              (tokenEntity.userAgentBrowser === ua.getBrowser().name &&
                tokenEntity.userAgentOS === ua.getOS().name)
            ) {
              if (
                tokenEntity.ip === ip ||
                ipLookup(ip)?.country === tokenEntity.ipCountryCode
              ) {
                return {
                  status: AuthenticationRefreshTokenStatus.ok,
                  tokenEntity,
                };
              } else
                return {
                  status: AuthenticationRefreshTokenStatus.suspiciousIP,
                  tokenEntity,
                };
            } else
              return {
                status: AuthenticationRefreshTokenStatus.suspiciousDevice,
                tokenEntity,
              };
          } else
            return {
              status: AuthenticationRefreshTokenStatus.wrongCode,
              tokenEntity,
            };
        } else
          return {
            status: AuthenticationRefreshTokenStatus.revoked,
            tokenEntity,
          };
      } else
        return {
          status: AuthenticationRefreshTokenStatus.notDefined,
          tokenEntity,
        };
    } else
      return { status: AuthenticationRefreshTokenStatus.notFound, tokenEntity };
  }

  @UseRequestContext()
  async refreshAuthenticationToken(
    token: string | Session,
  ): Promise<RefreshTokenDto> {
    const tokenEntity = await this.getDevice(token);
    const newToken = this.cryptoService.generateUUID();
    const refreshToken =
      this.cryptoService.generateRandomString(REFRESH_TOKEN_SIZE);
    tokenEntity.token = newToken;
    tokenEntity.refreshToken = this.cryptoService.hash(refreshToken);
    await this.sessionRepository.persistAndFlush(tokenEntity);
    const { accessToken } = await this.authenticationService.login(
      tokenEntity.userId,
      tokenEntity.token,
    );
    return { accessToken, refreshToken };
  }

  fireSuspiciousRequestEvent(token: string, ip: string, userAgent: string) {
    if (
      this.configService.get<boolean>('authentication.notifySuspiciousTokens')
    ) {
      this.eventEmitter.emit(
        'request.suspicious',
        new RequestSuspicious(token, ip, userAgent),
      );
    }
  }

  @UseRequestContext()
  async updateTokenUsage(
    token: string | Session,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    const tokenEntity = await this.getDevice(token);
    tokenEntity.lastUsage = new Date();
    tokenEntity.usage++;
    tokenEntity.ip = ip;
    tokenEntity.userAgent = userAgent;
    await this.sessionRepository.persistAndFlush(tokenEntity);
  }
}
