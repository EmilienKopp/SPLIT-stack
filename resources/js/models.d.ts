export interface Organization {
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
}

export interface OrganizationUser {
    id: number;
    user_id: number;
    user?: User;
    organization_id: number;
    organization?: Organization;
    elevated: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface Project {
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
}

export interface ProjectUser {
    id: number;
    project_id: number;
    project?: Project;
    user_id: number;
    user?: User;
    roles: any;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: Date | string;
    password: string;
    remember_token?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export type ModelTypes = Organization | OrganizationUser | Project | ProjectUser | User;