import { IsNotEmpty } from "class-validator"

export class CreateGameSimulationDto {
    @IsNotEmpty()
    session_count: number

    @IsNotEmpty()
    iteration_count: number
}
