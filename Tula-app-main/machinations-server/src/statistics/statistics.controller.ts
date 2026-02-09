import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatisticsService } from './statistics.service';


@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(+id);
  }
}
