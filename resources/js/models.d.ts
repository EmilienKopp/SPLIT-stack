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

export type ModelTypes = User;