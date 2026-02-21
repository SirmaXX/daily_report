import { Daily } from '../../daily/entities/daily.entity';
export declare enum UserRole {
    ADMIN = "admin",
    TEAM_LEADER = "team_leader",
    EMPLOYEE = "employee"
}
export declare enum UserRank {
    JUNIOR = "junior",
    MIDDLE = "middle",
    SENIOR = "senior",
    LEAD = "lead",
    MANAGER = "manager"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    rank: UserRank;
    manager: User;
    managerId: number;
    subordinates: User[];
    reports: Daily[];
}
