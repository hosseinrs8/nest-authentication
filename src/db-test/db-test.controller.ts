import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DbTestService } from './db-test.service';
import { CreateDbTestDto } from './create-db-test.dto';
import { DbTest } from './db-test.entity';

@Controller('db-test')
export class DbTestController {
  constructor(private readonly dbTestService: DbTestService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DbTest> {
    return this.dbTestService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateDbTestDto): Promise<DbTest> {
    return this.dbTestService.create(dto);
  }
}
