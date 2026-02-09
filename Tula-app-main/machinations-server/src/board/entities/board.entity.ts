import { TeamEntity } from "src/team/entities/team.entity"
import { UserEntity } from "src/user/entities/user.entity"
import { BoardHistoryEntity } from "src/board-history/entities/board-history.entity"
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm"

@Entity()
export class BoardEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@ManyToMany(() => UserEntity, (user) => user.boards, { cascade: true })
	users: UserEntity[]

	@Column({ default: false })
	is_favorite: boolean

	@Column()
	cover_image: string

	@Column({ default: false })
	title: string

	@Column()
	description: string

	@ManyToOne(() => BoardEntity, (board) => board.team)
	team: TeamEntity

	@Column({ default: 0 })
	currentVersion: number

	@ManyToOne(() => BoardHistoryEntity, { nullable: true })
	@JoinColumn()
	head: BoardHistoryEntity

	@OneToMany(() => BoardHistoryEntity, (history) => history.board)
	history: BoardHistoryEntity[]
}
