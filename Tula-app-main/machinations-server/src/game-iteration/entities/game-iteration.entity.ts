import { GameSessionEntity } from "src/game-session/entities/game-session.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameIterationEntity {
    @PrimaryGeneratedColumn()
    id: number

    // @ManyToOne(() => GameSessionEntity, (session) => session.iterations)
    // session: GameSessionEntity;

    @Column()
    value: number;    
}
