import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoolService } from './pool.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';

@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) { }

  @Post('sessions/:id')
  create(@Param('id') sessionId: number, @Body() createPoolDto: CreatePoolDto) {
    return this.poolService.createPoolForSession(sessionId, createPoolDto);
  }

  @Get('session/:id')
  findAllBySessionId(@Param('id') id: string) {
    return this.poolService.findAllBySessionId(+id);
  }

  @Get()
  findAll() {
    return this.poolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoolDto: UpdatePoolDto) {
    return this.poolService.update(+id, updatePoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolService.remove(+id);
  }
}
