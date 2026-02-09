import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	MaxLength,
	Validate,
	ValidateIf,
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

import { IsValidHistoryData } from "src/common/validators/history-data.validator"
import {
	BoardHistoryData,
	BoardHistoryType,
} from "../types/board-history.types"

export class CreateBoardHistoryDto {
	@ApiProperty({
		example: "snapshot",
		description: "Тип записи истории",
		enum: ["snapshot", "patch"],
	})
	@IsEnum(["snapshot", "patch"])
	type: BoardHistoryType

	@ApiProperty({
		description: "Данные доски",
		oneOf: [
			{
				example: {
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
			},
			{
				example: {
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
			},
		],
	})
	@IsNotEmpty()
	@Validate(IsValidHistoryData)
	data: BoardHistoryData

	@ApiProperty({
		example: "Инициализация схемы",
		description: "Комментарий к версии",
		required: false,
	})
	@IsOptional()
	@MaxLength(60)
	message?: string

	@ApiProperty({
		example: 1,
		description: "Базовая версия для патча",
		required: false,
	})
	@ValidateIf((o) => o.type === "patch")
	@IsNumber()
	baseVersion?: number
}
