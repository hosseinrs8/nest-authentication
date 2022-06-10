import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './user/entities/user.entity';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { CryptoService } from '../crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './interfaces';
import { Session } from './session/entities/session.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: EntityRepository<Session>,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly orm: MikroORM,
  ) {}

  @UseRequestContext()
  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ email: username });
    if (!user) await this.userRepository.findOne({ phone: username });
    if (user) {
      if (
        await this.cryptoService.verifyPassword(password, user.hashedPassword)
      ) {
        return user;
      }
    }
    return null;
  }

  async login(userId: number, token: string): Promise<{ accessToken: string }> {
    const payload: JWTPayload = { userId: userId, sub: token };
    return Promise.resolve({
      accessToken: this.jwtService.sign(payload),
    });
  }

  @UseRequestContext()
  async getProfile(userId: number, tokenId: number) {
    const user = await this.userRepository.findOne({ id: userId });
    const session = await this.sessionRepository.findOne({ id: tokenId });
    return { user, session };
  }
}
