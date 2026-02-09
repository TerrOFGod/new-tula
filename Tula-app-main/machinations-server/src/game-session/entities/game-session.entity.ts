import { GameIterationEntity } from "src/game-iteration/entities/game-iteration.entity"
import { GameSimulationEntity } from "src/game-simulation/entities/game-simulation.entity"
import { PoolEntity } from "src/pool/entities/pool.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class GameSessionEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    session_step: number

    @ManyToOne(() => GameSimulationEntity, (game_simulation) => game_simulation.game_sessions)
    game_simulation: GameSimulationEntity

    @OneToMany(() => PoolEntity, (pool) => pool.game_session)
    pools: PoolEntity[]

    // @OneToMany(() => GameIterationEntity, (iteration) => iteration.session)
    // iterations: GameIterationEntity[];
}
