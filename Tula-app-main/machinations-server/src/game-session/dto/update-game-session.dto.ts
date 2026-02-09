import { PartialType } from '@nestjs/mapped-types';
import { CreateGameSessionDto } from './create-game-session.dto';
import { PoolEntity } from 'src/pool/entities/pool.entity';

export class UpdateGameSessionDto extends PartialType(CreateGameSessionDto) {
    pools: PoolEntity[]
}
