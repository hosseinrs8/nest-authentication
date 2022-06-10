import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { CryptoService } from '../../crypto/crypto.service';
import { FilterQuery, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UsernameSearchDto,
  UsernameSearchKeys,
} from './dto/username-search.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly cryptoService: CryptoService,
    private readonly orm: MikroORM,
  ) {}

  @UseRequestContext()
  async create(dto: RegisterUserDto): Promise<User> {
    const user = new User();
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = dto.email;
    user.phone = dto.phone;
    user.hashedPassword = await this.cryptoService.hashPassword(dto.password);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  @UseRequestContext()
  findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ id }, { populate: ['sessions'] });
  }

  @UseRequestContext()
  findAll(limit: number | null = 15, offset = 0) {
    return this.userRepository.findAll({ limit, offset });
  }

  @UseRequestContext()
  findAdvance(
    where: FilterQuery<User>,
    limit: number | null = 15,
    offset = 0,
  ): Promise<Array<User>> {
    return this.userRepository.find(where, { limit, offset });
  }

  @UseRequestContext()
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
    user.firstName = dto.firstName || user.firstName;
    user.lastName = dto.lastName || user.lastName;
    user.email = dto.email || user.email;
    user.phone = dto.phone || user.phone;
    user.status = dto.status || user.status;
    user.preferredLocale = dto.preferredLocales || user.preferredLocale;
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  @UseRequestContext()
  async updatePassword(id: number, dto: UpdatePasswordDto): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    const passCheck = await this.cryptoService.verifyPassword(
      dto.oldPassword,
      user.hashedPassword,
    );
    if (passCheck) {
      user.hashedPassword = await this.cryptoService.hashPassword(
        dto.newPassword,
      );
    } else throw new UnauthorizedException();
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  @UseRequestContext()
  usernameSearch(
    dto: UsernameSearchDto,
    limit: number | null = 15,
    offset = 0,
  ): Promise<Array<User>> {
    switch (dto.key) {
      case UsernameSearchKeys.email:
        return this.findAdvance(
          {
            email: { $like: '%' + dto.value + '%' },
          },
          limit,
          offset,
        );
      case UsernameSearchKeys.phone:
        return this.findAdvance(
          {
            phone: { $like: '%' + dto.value + '%' },
          },
          limit,
          offset,
        );
    }
  }

  @UseRequestContext()
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne(id);
    return this.userRepository.removeAndFlush(user);
  }

  @UseRequestContext()
  async checkInfoToBeUnique(phone: string, email: string) {
    const result = await this.findAdvance({ phone });
    if (result.length > 0) {
      throw new BadRequestException('uniqueness violation in phone');
    }
    if (email) {
      const emailResult = await this.findAdvance({ email });
      if (emailResult.length > 0) {
        throw new BadRequestException('uniqueness violation in email');
      }
    }
  }
}
