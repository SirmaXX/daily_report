import { DailyService } from './daily.service';
import { CreateDailyDto } from './dto/create-daily.dto';
export declare class DailyController {
    private readonly dailyService;
    constructor(dailyService: DailyService);
    create(req: any, createDailyDto: CreateDailyDto): Promise<import("./entities/daily.entity").Daily | {
        error: any;
        stack: any;
    }>;
    findAll(req: any, userId?: string, startDate?: string, endDate?: string, search?: string): Promise<import("./entities/daily.entity").Daily[]>;
    findOne(id: number): Promise<import("./entities/daily.entity").Daily>;
}
