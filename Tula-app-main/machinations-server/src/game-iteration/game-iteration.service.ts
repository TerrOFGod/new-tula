import { Injectable } from '@nestjs/common';
import { CreateGameIterationDto } from './dto/create-game-iteration.dto';
import { UpdateGameIterationDto } from './dto/update-game-iteration.dto';

@Injectable()
export class GameIterationService {
  create(createGameIterationDto: CreateGameIterationDto) {
    return 'This action adds a new gameIteration';
  }

  findAll() {
    return `This action returns all gameIteration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameIteration`;
  }

  update(id: number, updateGameIterationDto: UpdateGameIterationDto) {
    return `This action updates a #${id} gameIteration`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameIteration`;
  }
}
