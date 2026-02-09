import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameIterationService } from './game-iteration.service';
import { CreateGameIterationDto } from './dto/create-game-iteration.dto';
import { UpdateGameIterationDto } from './dto/update-game-iteration.dto';

@Controller('game-iteration')
export class GameIterationController {
  constructor(private readonly gameIterationService: GameIterationService) {}

  @Post()
  create(@Body() createGameIterationDto: CreateGameIterationDto) {
    return this.gameIterationService.create(createGameIterationDto);
  }

  @Get()
  findAll() {
    return this.gameIterationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameIterationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameIterationDto: UpdateGameIterationDto) {
    return this.gameIterationService.update(+id, updateGameIterationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameIterationService.remove(+id);
  }
}
