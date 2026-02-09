import { BoardEntity } from "../../board/entities/board.entity"
import { UserEntity } from "../../user/entities/user.entity"
import { BoardHistoryData } from "../types/board-history.types"

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	Index,
} from "typeorm"

export type BoardHistoryType = "snapshot" | "patch"

@Entity()
@Index(["board", "version"], { unique: true })
export class BoardHistoryEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	createdAt: Date

	@Column({ type: "int" })
	version: number

	@Column({ type: "varchar" })
	type: BoardHistoryType

	@Column({ type: "jsonb" })
	data: BoardHistoryData

	@Column({ nullable: true, length: 60 })
	message: string

	@Column({ type: "int", nullable: true })
	baseVersion: number

	@ManyToOne(() => UserEntity)
	author: UserEntity

	@ManyToOne(() => BoardEntity, (board) => board.history)
	board: BoardEntity
}
