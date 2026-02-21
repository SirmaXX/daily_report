import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { DailyService } from './daily.service';
import { CreateDailyDto } from './dto/create-daily.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Daily Reports')
@ApiBearerAuth()
@Controller('daily')
@UseGuards(JwtAuthGuard)
export class DailyController {
  constructor(private readonly dailyService: DailyService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new daily report' })
  async create(@Request() req, @Body() createDailyDto: CreateDailyDto) {
    try {
      return await this.dailyService.create(req.user as User, createDailyDto);
    } catch (e: any) {
      return { error: e.message, stack: e.stack };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get reports visible to the current user' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Request() req,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
  ) {
    const user = req.user as User;
    const filters = {
      userId: userId ? parseInt(userId) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      search,
    };
    return this.dailyService.getReportsForUser(user, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific report by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Ideally check if user has access to this specific report
    return this.dailyService.findOne(id);
  }
}
