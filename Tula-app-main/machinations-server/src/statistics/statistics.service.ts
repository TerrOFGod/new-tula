import { Injectable } from '@nestjs/common';

@Injectable()
export class StatisticsService {
  findAll() {
    return `This action returns all statistics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }
}
