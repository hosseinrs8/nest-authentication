import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsernameSearchDto } from './dto/username-search.dto';
import { UserFindAdvanceDto } from './dto/user-find-advance.dto';
import { RegisterUserDto as CreateUserDto } from '../dto/register-user.dto';
import { AuthenticatedUserId } from '../decorators/authenticated-user-id.decorator';
import { User } from './entities/user.entity';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @AuthenticatedUserId() userId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    if (+id !== userId) throw new ForbiddenException();
    return this.userService.update(+id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Get()
  findAll(@Query('page') page = '0'): Promise<Array<User>> {
    return this.userService.findAll(15, +page * 15);
  }

  @Post('find')
  findAdvance(
    @Body() dto: UserFindAdvanceDto,
    @Query('page') page = '0',
  ): Promise<Array<User>> {
    return this.userService.findAdvance(dto, 15, +page * 15);
  }

  @Patch(':id/password')
  updatePassword(
    @Param('id') id: string,
    @AuthenticatedUserId() userId: number,
    @Body() dto: UpdatePasswordDto,
  ): Promise<User> {
    if (+id !== userId) throw new ForbiddenException();
    return this.userService.updatePassword(+id, dto);
  }

  @Post('username-search')
  usernameSearch(
    @Body() dto: UsernameSearchDto,
    @Query('page') page = '0',
  ): Promise<Array<User>> {
    return this.userService.usernameSearch(dto, 15, +page * 15);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @AuthenticatedUserId() userId: number,
  ): Promise<void> {
    if (userId !== +id) throw new ForbiddenException();
    return this.userService.remove(+id);
  }
}
