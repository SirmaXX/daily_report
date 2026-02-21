import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Daily {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column('text')
  content: string;

  @ApiProperty()
  @CreateDateColumn()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ required: false, nullable: true })
  @Column({ nullable: true })
  projectId: number;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
