import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
export declare class Daily {
    id: number;
    content: string;
    date: Date;
    userId: number;
    user: User;
    projectId: number;
    project: Project;
}
