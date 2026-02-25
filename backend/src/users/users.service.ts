import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.findOne(userId);
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(changePasswordDto.newPassword, salt);
    await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['manager'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['manager', 'subordinates'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async getSubordinates(managerId: number): Promise<User[]> {
    return this.usersRepository.find({ where: { manager: { id: managerId } } });
  }

  async update(
    id: number,
    updateData: Partial<CreateUserDto>,
    currentUser: User,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update users');
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateData.password, salt);
    }

    if (updateData.username) user.username = updateData.username;
    if (updateData.role) user.role = updateData.role;
    if (updateData.managerId !== undefined)
      user.managerId = updateData.managerId;

    return this.usersRepository.save(user);
  }

  async delete(id: number, currentUser: User): Promise<void> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
