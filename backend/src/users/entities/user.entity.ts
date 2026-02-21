import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Daily } from '../../daily/entities/daily.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  TEAM_LEADER = 'team_leader',
  EMPLOYEE = 'employee',
}

export enum UserRank {
  JUNIOR = 'junior',
  MIDDLE = 'middle',
  SENIOR = 'senior',
  LEAD = 'lead',
  MANAGER = 'manager',
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ enum: UserRole })
  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @ApiProperty({ enum: UserRank, required: false })
  @Column({
    type: 'simple-enum',
    enum: UserRank,
    default: UserRank.JUNIOR,
  })
  rank: UserRank;

  @ManyToOne(() => User, (user) => user.subordinates, { nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @ApiProperty({ required: false, nullable: true })
  @Column({ nullable: true })
  managerId: number;

  @OneToMany(() => User, (user) => user.manager)
  subordinates: User[];

  @OneToMany(() => Daily, (daily) => daily.user)
  reports: Daily[];
}
