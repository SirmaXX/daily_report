import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserRank } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'username123' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ enum: UserRole, required: false, default: UserRole.EMPLOYEE })
  role?: UserRole;

  @ApiProperty({ enum: UserRank, required: false, default: UserRank.JUNIOR })
  rank?: UserRank;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Manager ID if applicable',
  })
  managerId?: number;
}
