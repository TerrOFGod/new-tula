import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameSimulationService } from './game-simulation.service';
import { CreateGameSimulationDto } from './dto/create-game-simulation.dto';
import { UpdateGameSimulationDto } from './dto/update-game-simulation.dto';

@Controller('simulation')
export class GameSimulationController {
  constructor(private readonly simulationService: GameSimulationService) {}

  @Post()
  create(@Body() createGameSimulationDto: CreateGameSimulationDto) {
    return this.simulationService.create(createGameSimulationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulationService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameSimulationDto: UpdateGameSimulationDto) {
    return this.simulationService.update(+id, updateGameSimulationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulationService.remove(+id);
  }
}
