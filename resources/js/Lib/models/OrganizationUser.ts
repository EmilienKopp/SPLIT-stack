import { User, Organization, OrganizationUser } from '$models';

export class OrganizationUserBase implements OrganizationUser {
    id: number;
    user_id: number;
    user?: User;
    organization_id: number;
    organization?: Organization;
    elevated: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;


    constructor(data: OrganizationUser) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.organization_id = data.organization_id;
        this.elevated = data.elevated;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}