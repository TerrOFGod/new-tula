// src/board/board.module.ts
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BoardController } from "./board.controller"
import { BoardService } from "./board.service"
import { BoardEntity } from "./entities/board.entity"
import { UserEntity } from "../user/entities/user.entity"
import { BoardHistoryModule } from "../board-history/board-history.module"

@Module({
	imports: [
		TypeOrmModule.forFeature([BoardEntity, UserEntity]),
		BoardHistoryModule,
	],
	controllers: [BoardController],
	providers: [BoardService],
	exports: [BoardService],
})
export class BoardModule {}
