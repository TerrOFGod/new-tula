import { IsNotEmpty } from "class-validator"
export class CreatePoolDto {
    title: string

    description:string

    @IsNotEmpty()
    value: number
}
