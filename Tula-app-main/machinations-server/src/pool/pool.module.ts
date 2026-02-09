import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolController } from './pool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolEntity } from './entities/pool.entity';
import { GameSessionEntity } from 'src/game-session/entities/game-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoolEntity, GameSessionEntity])],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
