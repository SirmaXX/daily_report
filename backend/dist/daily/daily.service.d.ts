import { Repository } from 'typeorm';
import { Daily } from './entities/daily.entity';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
export interface ReportFilters {
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    projectId?: number;
}
export declare class DailyService {
    private dailyRepository;
    private readonly usersService;
    constructor(dailyRepository: Repository<Daily>, usersService: UsersService);
    create(user: User, createDailyDto: CreateDailyDto): Promise<Daily>;
    findAll(): Promise<Daily[]>;
    findOne(id: number): Promise<Daily>;
    findByUser(userId: number): Promise<Daily[]>;
    getReportsForUser(user: User, filters?: ReportFilters): Promise<Daily[]>;
}
