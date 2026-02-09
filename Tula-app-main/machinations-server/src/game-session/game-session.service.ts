import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateGameSessionDto } from './dto/update-game-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSessionEntity } from './entities/game-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameSessionService {
  constructor(@InjectRepository(GameSessionEntity)
  private sessionRepository: Repository<GameSessionEntity>) { }

  async findAll() {
    return this.sessionRepository.find({ relations: ['game_simulation'] });
  }

  async findAllBySimulationId(id: number) {
    const found = await this.sessionRepository.find({
      where: { game_simulation: { id } },
      relations: ['pools'],
    });
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }

  async findOne(id: number) {
    const found = await this.sessionRepository.findOne(
      {
        where: { id },
        relations: {
          pools: true,
        }
      }
    )
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }

  async update(id: number, updateGameSessionDto: UpdateGameSessionDto) {
    const found = this.sessionRepository.findOneBy({ id })
    if (!found) throw new NotFoundException("Not Found")
    return this.sessionRepository.update(id, updateGameSessionDto);
  }

  async remove(id: number) {
    return this.sessionRepository.delete(id);
  }
}
