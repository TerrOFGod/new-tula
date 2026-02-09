import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boardService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
