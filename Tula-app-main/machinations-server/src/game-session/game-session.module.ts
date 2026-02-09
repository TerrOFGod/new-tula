import { Module } from '@nestjs/common';
import { GameSessionService } from './game-session.service';
import { GameSessionController } from './game-session.controller';
import { GameSessionEntity } from './entities/game-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSimulationEntity } from 'src/game-simulation/entities/game-simulation.entity';
import { PoolEntity } from 'src/pool/entities/pool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameSessionEntity, GameSimulationEntity, PoolEntity])],
  controllers: [GameSessionController],
  providers: [GameSessionService],
  exports: [GameSessionService],
})
export class GameSessionModule { }
