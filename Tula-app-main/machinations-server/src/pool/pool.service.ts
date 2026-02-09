import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PoolEntity } from './entities/pool.entity';
import { Repository } from 'typeorm';
import { GameSessionEntity } from 'src/game-session/entities/game-session.entity';

@Injectable()
export class PoolService {
  constructor(@InjectRepository(PoolEntity) private poolRepository: Repository<PoolEntity>,
    @InjectRepository(GameSessionEntity) private sessionRepository: Repository<GameSessionEntity>
  ) { }

  async createPoolForSession(@Param('id') sessionId: number, @Body() createPoolDto: CreatePoolDto) {
    const savedPool = await this.poolRepository.save(createPoolDto);

    // Поиск сессии
    const gameSession = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['pools'],
    });

    if (!gameSession) {
      throw new NotFoundException('GameSession not found');
    }

    gameSession.pools.push(savedPool);
    await this.sessionRepository.save(gameSession);

    return savedPool;
  }

  async findAllBySessionId(id: number) {
    const found = this.poolRepository.find(
      { where: { game_session: { id } } }
    )
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }


  async findAll() {
    return this.poolRepository.find();
  }

  async findOne(id: number) {
    const found = this.poolRepository.findOne(
      {
        where: { id },
        relations: {
          game_session: true,
        }
      }
    )
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }

  async update(id: number, updatePoolDto: UpdatePoolDto) {
    const found = this.poolRepository.findOneBy({ id })
    if (!found) throw new NotFoundException("Not Found")
    return this.poolRepository.update(id, updatePoolDto);
  }

  async remove(id: number) {
    return this.poolRepository.delete(id);
  }
}
