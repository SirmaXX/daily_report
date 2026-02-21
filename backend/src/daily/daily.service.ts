import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  In,
  Like,
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { Daily } from './entities/daily.entity';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

export interface ReportFilters {
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  projectId?: number;
}

@Injectable()
export class DailyService {
  constructor(
    @InjectRepository(Daily)
    private dailyRepository: Repository<Daily>,
    private readonly usersService: UsersService,
  ) {}

  async create(user: User, createDailyDto: CreateDailyDto): Promise<Daily> {
    const insertData: any = {
      content: createDailyDto.content,
      userId: user.id,
    };
    if (createDailyDto.projectId) {
      insertData.projectId = createDailyDto.projectId;
    }
    const result = await this.dailyRepository.insert(insertData);
    return this.findOne(result.identifiers[0].id);
  }

  async findAll(): Promise<Daily[]> {
    return this.dailyRepository.find({ relations: ['user', 'project'] });
  }

  async findOne(id: number): Promise<Daily> {
    const daily = await this.dailyRepository.findOne({
      where: { id },
      relations: ['user', 'project'],
    });
    if (!daily) {
      throw new NotFoundException(`Daily with id ${id} not found`);
    }
    return daily;
  }

  async findByUser(userId: number): Promise<Daily[]> {
    return this.dailyRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'project'],
    });
  }

  async getReportsForUser(
    user: User,
    filters?: ReportFilters,
  ): Promise<Daily[]> {
    let baseQuery: Daily[];

    if (user.role === UserRole.ADMIN) {
      baseQuery = await this.findAll();
    } else if (user.role === UserRole.TEAM_LEADER) {
      const subordinates = await this.usersService.getSubordinates(user.id);
      const subordinateIds = subordinates.map((u) => u.id);
      subordinateIds.push(user.id);

      if (subordinateIds.length === 0) {
        baseQuery = [];
      } else {
        baseQuery = await this.dailyRepository.find({
          where: { user: { id: In(subordinateIds) } },
          relations: ['user'],
        });
      }
    } else {
      baseQuery = await this.findByUser(user.id);
    }

    if (!filters) {
      return baseQuery;
    }

    return baseQuery.filter((report) => {
      if (filters.userId && report.user?.id !== filters.userId) return false;
      if (filters.startDate && new Date(report.date) < filters.startDate)
        return false;
      if (filters.endDate && new Date(report.date) > filters.endDate)
        return false;
      if (
        filters.search &&
        !report.content.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }
}
