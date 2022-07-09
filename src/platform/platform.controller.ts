import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformFindAdvanceDto } from './dto/platform-find-advance.dto';
import { Platform } from './entities/platform.entity';
import { Report } from './entities/report.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Platform')
@Controller('platform')
export class PlatformController {
  private pageSize = 10;

  constructor(private readonly platformService: PlatformService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Platform> {
    return this.platformService.findOne(+id);
  }

  @Get()
  findAll(@Query('page') page = '0'): Promise<Array<Platform>> {
    return this.platformService.findAll(this.pageSize, +page * this.pageSize);
  }

  @Post('find-advance')
  findAdvance(
    @Body() dto: PlatformFindAdvanceDto,
    @Query('page') page = '0',
  ): Promise<Array<Platform>> {
    return this.platformService.findAdvance(
      dto,
      this.pageSize,
      +page * this.pageSize,
    );
  }

  @Get(':id/reports')
  getReports(@Param('id') id: string): Promise<Array<Report>> {
    return this.platformService.getReports(+id);
  }
}
