// src/board-history/board-history.module.ts
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { BoardEntity } from "../board/entities/board.entity"
import { UserEntity } from "../user/entities/user.entity"

import { BoardHistoryController } from "./board-history.controller"
import { BoardHistoryService } from "./board-history.service"
import { BoardHistoryEntity } from "./entities/board-history.entity"

@Module({
	imports: [
		TypeOrmModule.forFeature([BoardHistoryEntity, BoardEntity, UserEntity]),
	],
	controllers: [BoardHistoryController],
	providers: [BoardHistoryService],
	exports: [BoardHistoryService],
})
export class BoardHistoryModule {}
