import { PartialType } from '@nestjs/mapped-types';
import { CreateGameIterationDto } from './create-game-iteration.dto';

export class UpdateGameIterationDto extends PartialType(CreateGameIterationDto) {}
