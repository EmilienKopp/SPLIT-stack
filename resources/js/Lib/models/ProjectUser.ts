import { Project, User, ProjectUser } from '$models';

export class ProjectUserBase implements ProjectUser {
    id: number;
    project_id: number;
    project?: Project;
    user_id: number;
    user?: User;
    roles: any;
    created_at?: Date | string;
    updated_at?: Date | string;


    constructor(data: ProjectUser) {
        this.id = data.id;
        this.project_id = data.project_id;
        this.user_id = data.user_id;
        this.roles = data.roles;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}