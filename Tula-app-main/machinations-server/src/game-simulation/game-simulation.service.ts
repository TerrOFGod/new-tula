import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateGameSimulationDto } from './dto/create-game-simulation.dto';
import { UpdateGameSimulationDto } from './dto/update-game-simulation.dto';
import { GameSimulationEntity } from './entities/game-simulation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSessionEntity } from 'src/game-session/entities/game-session.entity';

@Injectable()
export class GameSimulationService {
  constructor(@InjectRepository(GameSimulationEntity)
  private simulationRepository: Repository<GameSimulationEntity>,
    @InjectRepository(GameSessionEntity)
    private sessionRepository: Repository<GameSessionEntity>) { }

  async create(@Body() simulationDto: CreateGameSimulationDto) {
    const savedSimulation = await this.simulationRepository.save(simulationDto)
    const sessionsToCreate = simulationDto.session_count;
    const sessions: GameSessionEntity[] = [];

    for (let i = 0; i < sessionsToCreate; i++) {
      const session = this.sessionRepository.create({
        game_simulation: savedSimulation,
        session_step: i + 1,
        pools: []
      });
      sessions.push(session);
    }

    await this.sessionRepository.save(sessions);
    return sessions;
  }
  async findOneById(id: number) {
    const found = this.simulationRepository.findOne(
      {
        where: { id },
        relations: {
          game_sessions: true,
        }
      }
    )
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }

  async update(id: number, updateSimulationDto: UpdateGameSimulationDto) {
    const found = this.simulationRepository.findOneBy({ id })
    if (!found) throw new NotFoundException("Not Found")
    return this.simulationRepository.update(id, updateSimulationDto);
  }

  async remove(id: number) {
    return this.simulationRepository.delete(id);
  }

}
