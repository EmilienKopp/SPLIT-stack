import { Organization, Project } from '$models';

export class ProjectBase implements Project {
    id: number;
    organization_id: number;
    organization?: Organization;
    name: string;
    description?: string;
    type: string;
    status: string;
    start_date?: Date | string;
    end_date?: Date | string;
    location?: string;
    icon?: string;
    default_break_duration_seconds?: string;
    metadata?: any;
    created_at?: Date | string;
    updated_at?: Date | string;
    deleted_at?: Date | string;


    constructor(data: Project) {
        this.id = data.id;
        this.organization_id = data.organization_id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.status = data.status;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.location = data.location;
        this.icon = data.icon;
        this.default_break_duration_seconds = data.default_break_duration_seconds;
        this.metadata = data.metadata;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.deleted_at = data.deleted_at;
    }
}