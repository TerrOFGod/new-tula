import { Module } from '@nestjs/common';
import { GameSimulationService } from './game-simulation.service';
import { GameSimulationController } from './game-simulation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSimulationEntity } from './entities/game-simulation.entity';
import { GameSessionEntity } from 'src/game-session/entities/game-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameSimulationEntity, GameSessionEntity])],
  controllers: [GameSimulationController],
  providers: [GameSimulationService],
  exports: [GameSimulationService],
})
export class GameSimulationModule {}
