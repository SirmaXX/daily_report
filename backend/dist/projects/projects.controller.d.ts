import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(data: {
        name: string;
        description?: string;
        leaderId?: number;
    }): Promise<import("./entities/project.entity").Project>;
    findAll(): Promise<import("./entities/project.entity").Project[]>;
    findOne(id: number): Promise<import("./entities/project.entity").Project>;
    update(id: number, data: any): Promise<import("./entities/project.entity").Project>;
    delete(id: number): Promise<void>;
}
