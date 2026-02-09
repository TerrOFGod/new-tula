import { IsNotEmpty } from "class-validator"

export class CreateTeamDto {
    @IsNotEmpty()
    title: string
}
