import {
	Injectable,
	NotFoundException,
	BadRequestException,
	UnauthorizedException,
	ForbiddenException,
	ConflictException,
	InternalServerErrorException,
	HttpException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, EntityManager } from "typeorm"
import { applyPatch, Operation } from "fast-json-patch"

import { BoardEntity } from "../board/entities/board.entity"
import { UserEntity } from "../user/entities/user.entity"
import {
	BoardHistoryEntity,
	BoardHistoryType,
} from "./entities/board-history.entity"
import { CreateBoardHistoryDto } from "./dto/create-board-history.dto"
import { BoardPatchData, BoardSnapshotData } from "./types/board-history.types"

@Injectable()
export class BoardHistoryService {
	constructor(
		@InjectRepository(BoardHistoryEntity)
		private readonly historyRepository: Repository<BoardHistoryEntity>,
		@InjectRepository(BoardEntity)
		private readonly boardRepository: Repository<BoardEntity>,
		private readonly entityManager: EntityManager,
	) {}

	private async checkBoardAccess(
		userId: number,
		teamId: number,
	): Promise<boolean> {
		// Implement your actual access check logic
		return true
	}

	async createVersion(
		boardId: number,
		dto: CreateBoardHistoryDto,
		user: UserEntity,
	): Promise<BoardHistoryEntity> {
		if (!user) {
			throw new UnauthorizedException({
				errorCode: "AUTH_REQUIRED",
				message: "Authentication required to perform this action",
			})
		}

		try {
			return this.entityManager.transaction(async (manager) => {
				const board = await manager.findOne(BoardEntity, {
					where: { id: boardId },
					relations: ["head", "team"],
				})

				if (!board) {
					throw new NotFoundException({
						errorCode: "BOARD_NOT_FOUND",
						message: `Board with ID ${boardId} does not exist`,
					})
				}

				// Check team permissions
				const hasAccess = await this.checkBoardAccess(user.id, board.team.id)
				if (!hasAccess) {
					throw new ForbiddenException({
						errorCode: "ACCESS_DENIED",
						message: "You do not have permission to modify this board",
					})
				}

				if (dto.type === "patch") {
					if (!dto.baseVersion) {
						throw new BadRequestException({
							errorCode: "MISSING_BASE_VERSION",
							message: "Base version is required for patch operations",
						})
					}

					const baseExists = await manager.exists(BoardHistoryEntity, {
						where: {
							board: { id: boardId },
							version: dto.baseVersion,
						},
					})

					if (!baseExists) {
						throw new NotFoundException({
							errorCode: "BASE_VERSION_NOT_FOUND",
							message: `Base version ${dto.baseVersion} does not exist`,
						})
					}
				}

				const newVersionNumber = board.currentVersion + 1
				const newHistory = manager.create(BoardHistoryEntity, {
					version: newVersionNumber,
					type: dto.type,
					data: dto.data,
					message: dto.message,
					baseVersion: dto.baseVersion,
					author: user,
					board: { id: boardId },
				})

				await manager.save(BoardHistoryEntity, newHistory)

				await manager.update(
					BoardEntity,
					{ id: boardId },
					{
						currentVersion: newVersionNumber,
						head: newHistory,
						updatedAt: new Date(),
					},
				)

				return newHistory
			})
		} catch (error) {
			if (error.code === "23505") {
				// PostgreSQL duplicate version error
				throw new ConflictException({
					errorCode: "VERSION_CONFLICT",
					message: "Version number already exists for this board",
				})
			}

			if (error instanceof HttpException) {
				throw error
			}

			throw new InternalServerErrorException({
				errorCode: "INTERNAL_ERROR",
				message: "Failed to create new version",
			})
		}
	}

	async getBoardHistory(
		boardId: number,
		search?: string,
		start?: Date,
		end?: Date,
	): Promise<Record<number, BoardHistoryEntity[]>> {
		const query = this.historyRepository
			.createQueryBuilder("history")
			.leftJoinAndSelect("history.author", "author")
			.where("history.boardId = :boardId", { boardId })
			.orderBy("history.version", "DESC")

		if (search) {
			query.andWhere("history.message ILIKE :search", {
				search: `%${search}%`,
			})
		}

		if (start) {
			query.andWhere("history.createdAt >= :start", { start })
		}

		if (end) {
			query.andWhere("history.createdAt <= :end", { end })
		}

		const records = await query.getMany()

		return records.reduce(
			(acc, record) => {
				if (record.type === "snapshot") {
					acc.currentBase = record.version
					acc.groups[record.version] = [record]
				} else if (acc.currentBase !== undefined) {
					acc.groups[acc.currentBase].push(record)
				}
				return acc
			},
			{
				currentBase: undefined,
				groups: {} as Record<number, BoardHistoryEntity[]>,
			},
		).groups
	}

	async restoreVersion(
		boardId: number,
		versionId: number,
	): Promise<BoardSnapshotData> {
		const versionChain: BoardHistoryEntity[] = []
		let currentVersion = await this.historyRepository.findOne({
			where: { id: versionId, board: { id: boardId } },
			relations: ["board"],
		})

		if (!currentVersion) {
			throw new NotFoundException(
				`Version ${versionId} not found for board ${boardId}`,
			)
		}

		while (currentVersion) {
			versionChain.unshift(currentVersion)

			if (currentVersion.type === "snapshot") break

			currentVersion = await this.historyRepository.findOne({
				where: {
					board: { id: boardId },
					version: currentVersion.baseVersion,
				},
			})

			if (!currentVersion) {
				throw new NotFoundException(
					`Base version ${currentVersion?.baseVersion} not found`,
				)
			}
		}

		try {
			return versionChain.reduce(
				(state: BoardSnapshotData, version) => {
					if (version.type === "snapshot") {
						// Явное приведение типа для snapshot данных
						return version.data as BoardSnapshotData
					}

					// Проверка типа для patch данных
					if ("patches" in version.data) {
						const patchData = version.data as BoardPatchData
						const patchResult = applyPatch(
							state,
							patchData.patches as Operation[],
						)
						return patchResult.newDocument as BoardSnapshotData
					}

					throw new Error("Invalid history data type")
				},
				{ nodes: [], edges: [] },
			) // Инициализация начального состояния
		} catch (error) {
			throw new BadRequestException("Failed to apply patches: " + error.message)
		}
	}

	async pruneHistory(
		boardId: number,
		keepLast = 50,
	): Promise<{ deleted: number }> {
		if (keepLast < 1) {
			throw new BadRequestException("keepLast must be at least 1")
		}

		const history = await this.historyRepository
			.createQueryBuilder("history")
			.where("history.boardId = :boardId", { boardId })
			.orderBy("history.version", "DESC")
			.skip(keepLast)
			.take(1000)
			.getMany()

		if (history.length === 0) {
			return { deleted: 0 }
		}

		await this.historyRepository.remove(history)
		return { deleted: history.length }
	}
}
