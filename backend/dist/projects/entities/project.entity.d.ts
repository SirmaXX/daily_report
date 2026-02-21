import { User } from '../../users/entities/user.entity';
export declare class Project {
    id: number;
    name: string;
    description: string;
    leader: User;
    leaderId: number;
    isActive: boolean;
    createdAt: Date;
}
