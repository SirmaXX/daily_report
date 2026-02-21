"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_entity_1 = require("./entities/daily.entity");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
let DailyService = class DailyService {
    dailyRepository;
    usersService;
    constructor(dailyRepository, usersService) {
        this.dailyRepository = dailyRepository;
        this.usersService = usersService;
    }
    async create(user, createDailyDto) {
        const insertData = {
            content: createDailyDto.content,
            userId: user.id,
        };
        if (createDailyDto.projectId) {
            insertData.projectId = createDailyDto.projectId;
        }
        const result = await this.dailyRepository.insert(insertData);
        return this.findOne(result.identifiers[0].id);
    }
    async findAll() {
        return this.dailyRepository.find({ relations: ['user', 'project'] });
    }
    async findOne(id) {
        const daily = await this.dailyRepository.findOne({
            where: { id },
            relations: ['user', 'project'],
        });
        if (!daily) {
            throw new common_1.NotFoundException(`Daily with id ${id} not found`);
        }
        return daily;
    }
    async findByUser(userId) {
        return this.dailyRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'project'],
        });
    }
    async getReportsForUser(user, filters) {
        let baseQuery;
        if (user.role === user_entity_1.UserRole.ADMIN) {
            baseQuery = await this.findAll();
        }
        else if (user.role === user_entity_1.UserRole.TEAM_LEADER) {
            const subordinates = await this.usersService.getSubordinates(user.id);
            const subordinateIds = subordinates.map((u) => u.id);
            subordinateIds.push(user.id);
            if (subordinateIds.length === 0) {
                baseQuery = [];
            }
            else {
                baseQuery = await this.dailyRepository.find({
                    where: { user: { id: (0, typeorm_2.In)(subordinateIds) } },
                    relations: ['user'],
                });
            }
        }
        else {
            baseQuery = await this.findByUser(user.id);
        }
        if (!filters) {
            return baseQuery;
        }
        return baseQuery.filter((report) => {
            if (filters.userId && report.user?.id !== filters.userId)
                return false;
            if (filters.startDate && new Date(report.date) < filters.startDate)
                return false;
            if (filters.endDate && new Date(report.date) > filters.endDate)
                return false;
            if (filters.search &&
                !report.content.toLowerCase().includes(filters.search.toLowerCase()))
                return false;
            return true;
        });
    }
};
exports.DailyService = DailyService;
exports.DailyService = DailyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_entity_1.Daily)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], DailyService);
//# sourceMappingURL=daily.service.js.map