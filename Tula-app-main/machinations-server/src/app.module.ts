import { APP_INTERCEPTOR } from "@nestjs/core"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { DataParserService } from "./data-parser/data-parser.service"
import { DataParserController } from "./data-parser/data-parser.controller"

import { BoardModule } from "./board/board.module"
import { UserModule } from "./user/user.module"
import { PoolModule } from "./pool/pool.module"
import { TeamModule } from "./team/team.module"
import { StatisticsModule } from "./statistics/statistics.module"
import { GameSessionModule } from "./game-session/game-session.module"
import { GameSimulationModule } from "./game-simulation/game-simulation.module"
import { GameIterationModule } from "./game-iteration/game-iteration.module"
import { BoardHistoryModule } from "./board-history/board-history.module"

import { UserEntity } from "./user/entities/user.entity"
import { BoardEntity } from "./board/entities/board.entity"
import { BoardHistoryEntity } from "./board-history/entities/board-history.entity"
import { PoolEntity } from "./pool/entities/pool.entity"
import { TeamEntity } from "./team/entities/team.entity"
import { GameSessionEntity } from "./game-session/entities/game-session.entity"
import { GameSimulationEntity } from "./game-simulation/entities/game-simulation.entity"
import { TransformInterceptor } from "./common/config/transform.config"

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env.local",
		}),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [
				UserEntity,
				BoardEntity,
				BoardHistoryEntity,
				PoolEntity,
				TeamEntity,
				GameSessionEntity,
				GameSimulationEntity,
			],
			synchronize: process.env.DB_SYNCHRONIZE === "true",
			autoLoadEntities: process.env.AUTO_LOAD_ENTITIES === "true",
		}),
		BoardModule,
		BoardHistoryModule,
		UserModule,
		PoolModule,
		TeamModule,
		GameSessionModule,
		GameSimulationModule,
		StatisticsModule,
		GameIterationModule,
	],
	controllers: [AppController, DataParserController],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		AppService,
		DataParserService,
	],
})
export class AppModule {}
