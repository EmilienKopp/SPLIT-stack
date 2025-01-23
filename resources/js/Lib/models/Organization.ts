import { User, Organization } from '$models';

export class OrganizationBase implements Organization {
    id: number;
    user_id?: number;
    user?: User;
    name: string;
    description?: string;
    type: string;
    icon?: string;
    metadata?: any;
    created_at?: Date | string;
    updated_at?: Date | string;


    constructor(data: Organization) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.icon = data.icon;
        this.metadata = data.metadata;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}