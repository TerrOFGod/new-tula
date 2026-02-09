import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { UpdateGameSessionDto } from './dto/update-game-session.dto';

@Controller('session')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Get()
  findAll() {
    return this.gameSessionService.findAll();
  }
  @Get('/all/:id')
  findAllBySimulationId(@Param('id') id: string) {
    return this.gameSessionService.findAllBySimulationId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameSessionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameSessionDto: UpdateGameSessionDto) {
    return this.gameSessionService.update(+id, updateGameSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameSessionService.remove(+id);
  }
}
