import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(BoardEntity) private boardRepository: Repository<BoardEntity>
  ) { }

  async create(@Body() userDto: CreateUserDto) {
    return this.userRepository.save({
      firstname: userDto.firstname,
      lastname: userDto.lastname,
      email: userDto.email,
      password: userDto.password,
      boards: []
    });
  }

  async createBoardForUser(@Param('id') userId: number, @Body() boardDto: CreateBoardDto) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const board = this.boardRepository.create({
      ...boardDto,
      users: [{ ...user }],
    });

    return this.boardRepository.save(board);
  }

  async findAll() {
    return this.userRepository.find({ relations: ['boards'] });
  }

  async findOneById(id: number) {
    const found = this.userRepository.findOne(
      {
        where: { id },
        relations: {
          boards: true,
        }
      }
    )
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }

  async findOneByEmail(email: string) {
    const found = await this.userRepository.findOne(
      {
        where: { email },
        relations: {
          boards: true,
        }
      }
    )
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const found = this.userRepository.findOneBy({ id })
    if (!found) throw new NotFoundException("Not Found")
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
