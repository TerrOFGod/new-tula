import { BoardEntity } from "src/board/entities/board.entity"
import { UserEntity } from "src/user/entities/user.entity"
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class TeamEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @Column()
    title: string

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[]

    @OneToMany(() => BoardEntity, (board) => board.team)
    boards: BoardEntity[]
}