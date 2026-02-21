import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findOneByUsername(username: string): Promise<User | null>;
    getSubordinates(managerId: number): Promise<User[]>;
    update(id: number, updateData: Partial<CreateUserDto>, currentUser: User): Promise<User>;
    delete(id: number, currentUser: User): Promise<void>;
}
