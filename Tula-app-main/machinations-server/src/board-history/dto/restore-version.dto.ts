// src/board-history/dto/restore-version.dto.ts
import { IsNumber } from "class-validator"

export class RestoreVersionDto {
	@IsNumber()
	versionId: number
}
