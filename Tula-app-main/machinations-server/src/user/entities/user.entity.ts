import { BoardEntity } from "src/board/entities/board.entity";
import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    password: string

    @CreateDateColumn()
    createdAt: Date

    @ManyToMany(() => BoardEntity, (board) => board.users)
    @JoinTable()
    boards: BoardEntity[];
}