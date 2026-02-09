import {
	Controller,
	Post,
	Get,
	Body,
	Param,
	Query,
	Delete,
	ParseIntPipe,
	BadRequestException,
} from "@nestjs/common"
import { BoardHistoryService } from "./board-history.service"
import { User } from "../decorators/user.decorator"
import { CreateBoardHistoryDto } from "./dto/create-board-history.dto"
import { RestoreVersionDto } from "./dto/restore-version.dto"
import { UserEntity } from "../user/entities/user.entity"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { BoardHistoryEntity } from "./entities/board-history.entity"

@ApiTags("Board History")
@Controller("boards/:boardId/history")
export class BoardHistoryController {
	constructor(private readonly historyService: BoardHistoryService) {}

	@Post()
	@ApiOperation({ summary: "Создать новую запись в истории" })
	@ApiBody({
		description: "Данные для создания записи истории",
		type: CreateBoardHistoryDto,
		examples: {
			snapshotExample: {
				summary: "Пример снапшота",
				value: {
					type: "snapshot",
					data: {
						nodes: [
							{
								id: "node-1",
								type: "poolNode",
								position: { x: 0, y: 0 },
								data: {
									label: "0",
									struct: "Pool",
									name: "",
								},
							},
							{
								id: "node-2",
								type: "converterNode",
								position: { x: 100, y: 100 },
								data: {
									label: "0",
									struct: "Converter",
									name: "",
								},
							},
						],
						edges: [
							{
								id: "edge-1",
								source: "node-1",
								target: "node-2",
								type: "custom",
								markerEnd: {
									type: "arrowclosed",
									width: 20,
									height: 20,
									color: "black",
								},
							},
						],
					},
					message: "Начальная конфигурация схемы",
				},
			},
			patchExample: {
				summary: "Пример патча",
				value: {
					type: "patch",
					baseVersion: 1,
					data: {
						base: 1,
						patches: [
							{
								op: "add",
								path: "/nodes/-",
								value: {
									id: "node-3",
									type: "gateNode",
									position: { x: 200, y: 200 },
									data: {
										label: 0,
										struct: "Gate",
										name: "",
									},
								},
							},
						],
					},
					message: "Добавлен новый гейт",
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: "Запись успешно создана",
		type: BoardHistoryEntity,
	})
	@ApiResponse({
		status: 400,
		description: "Invalid request data",
		schema: {
			example: {
				statusCode: 400,
				errorCode: "MISSING_BASE_VERSION",
				message: "Base version is required for patch operations",
			},
		},
	})
	@ApiResponse({
		status: 401,
		description: "Authentication required",
		schema: {
			example: {
				statusCode: 401,
				errorCode: "AUTH_REQUIRED",
				message: "Authentication required to perform this action",
			},
		},
	})
	@ApiResponse({
		status: 403,
		description: "Access denied",
		schema: {
			example: {
				statusCode: 403,
				errorCode: "ACCESS_DENIED",
				message: "You do not have permission to modify this board",
			},
		},
	})
	@ApiResponse({
		status: 404,
		description: "Resource not found",
		schema: {
			examples: {
				boardNotFound: {
					statusCode: 404,
					errorCode: "BOARD_NOT_FOUND",
					message: "Board with ID 123 does not exist",
				},
				baseVersionNotFound: {
					statusCode: 404,
					errorCode: "BASE_VERSION_NOT_FOUND",
					message: "Base version 5 does not exist",
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: "Version conflict",
		schema: {
			example: {
				statusCode: 409,
				errorCode: "VERSION_CONFLICT",
				message: "Version number already exists for this board",
			},
		},
	})
	@ApiResponse({
		status: 500,
		description: "Internal server error",
		schema: {
			example: {
				statusCode: 500,
				errorCode: "INTERNAL_ERROR",
				message: "Failed to create new version",
			},
		},
	})
	async createHistoryEntry(
		@Param("boardId", ParseIntPipe) boardId: number,
		@Body() dto: CreateBoardHistoryDto,
		@User() user: UserEntity,
	) {
		try {
			return await this.historyService.createVersion(boardId, dto, user)
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	@Get()
	@ApiOperation({ summary: "Получить историю версий схемы с филтрацией" })
	@ApiResponse({ status: 200, description: "History records" })
	async getHistory(
		@Param("boardId", ParseIntPipe) boardId: number,
		@Query("search") search?: string,
		@Query("start") start?: Date,
		@Query("end") end?: Date,
	) {
		if (start && end && start > end) {
			throw new BadRequestException("Start date cannot be after end date")
		}

		return this.historyService.getBoardHistory(boardId, search, start, end)
	}

	@Post("restore")
	@ApiOperation({ summary: "Восстановить версию схемы" })
	@ApiResponse({ status: 200, description: "Restored board state" })
	async restoreVersion(
		@Param("boardId", ParseIntPipe) boardId: number,
		@Body() { versionId }: RestoreVersionDto,
	) {
		try {
			return await this.historyService.restoreVersion(boardId, versionId)
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	@Delete()
	@ApiOperation({ summary: "Очистить старые версии схемы" })
	@ApiResponse({ status: 200, description: "Cleanup result" })
	async pruneHistory(
		@Param("boardId", ParseIntPipe) boardId: number,
		@Query("keepLast") keepLast = 50,
	) {
		if (isNaN(keepLast)) {
			throw new BadRequestException("keepLast must be a number")
		}
		return this.historyService.pruneHistory(boardId, keepLast)
	}
}
