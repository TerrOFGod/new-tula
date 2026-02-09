import { Module } from '@nestjs/common';
import { GameIterationService } from './game-iteration.service';
import { GameIterationController } from './game-iteration.controller';

@Module({
  controllers: [GameIterationController],
  providers: [GameIterationService]
})
export class GameIterationModule {}
