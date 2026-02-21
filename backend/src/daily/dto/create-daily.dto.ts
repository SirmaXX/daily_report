import { ApiProperty } from '@nestjs/swagger';

export class CreateDailyDto {
  @ApiProperty({ example: 'Bugün bunları yaptım...' })
  content: string;

  @ApiProperty({ required: false })
  projectId?: number;
}
