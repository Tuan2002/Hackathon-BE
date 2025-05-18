import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { PointHistory } from './entities/point-history.entity';
@Injectable()
export class PointHistoryService {
  constructor(
    @InjectRepository(PointHistory)
    private pointHistoryRepository: Repository<PointHistory>,
  ) {}

  async getPointHistoriesByUserIdAsync(userId: string) {
    const pointHistories = await this.pointHistoryRepository.find({
      where: {
        historyUserId: userId,
      },
      relations: ['historyUser'],
      order: {
        createdAt: 'DESC',
      },
    });
    return pointHistories.map((pointHistory) => {
      return plainToInstance(
        PointHistory,
        {
          ...pointHistory,
          userName: `${pointHistory.historyUser.firstName} ${pointHistory.historyUser.lastName}`,
          avatar: pointHistory.historyUser.avatar,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    });
  }
}
