import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamEntity } from './entities/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeamService {
  constructor(@InjectRepository(TeamEntity) private teamRepository: Repository<TeamEntity>
  ) { }
  async create(createTeamDto: CreateTeamDto) {
    return this.teamRepository.save(createTeamDto)
  }

  async findAll() {
    return this.teamRepository.find({ relations: ['boards', 'users'] });
  }

  async findOne(id: number) {
    const found = this.teamRepository.findOne(
      {
        where: { id },
        relations: {
          boards: true,
          users: true
        }
      }
    )
    if (!found) throw new NotFoundException("Not Found")
    return found;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const found = this.teamRepository.findOneBy({ id })
    if (!found) throw new NotFoundException("Not Found")
    return this.teamRepository.update(id, updateTeamDto);
  }

  async remove(id: number) {
    return this.teamRepository.delete(id);
  }
}
