import { GameSessionEntity } from "src/game-session/entities/game-session.entity"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class GameSimulationEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    session_count: number

    @Column()
    iteration_count: number

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => GameSessionEntity, (game_sessions) => game_sessions.game_simulation)
    game_sessions: GameSessionEntity[]
}
