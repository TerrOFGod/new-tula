import { GameSessionEntity } from "src/game-session/entities/game-session.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PoolEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description:string

    @Column()
    value: number

    @ManyToOne(() => GameSessionEntity, (game_session) => game_session.pools)
    game_session: GameSessionEntity
}