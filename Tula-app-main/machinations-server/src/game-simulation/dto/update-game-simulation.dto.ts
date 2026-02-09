import { PartialType } from '@nestjs/mapped-types';
import { CreateGameSimulationDto } from './create-game-simulation.dto';

export class UpdateGameSimulationDto extends PartialType(CreateGameSimulationDto) {}
