import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyService } from './daily.service';
import { DailyController } from './daily.controller';
import { UsersModule } from '../users/users.module';
import { Daily } from './entities/daily.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Daily]),
    UsersModule
  ],
  controllers: [DailyController],
  providers: [DailyService],
})
export class DailyModule { }
