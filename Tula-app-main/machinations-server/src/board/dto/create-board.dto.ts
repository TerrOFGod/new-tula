import {IsNotEmpty,} from "class-validator";

export class CreateBoardDto {
    is_favorite: boolean

    cover_image?: string

    @IsNotEmpty()
    title: string

    description: string
}