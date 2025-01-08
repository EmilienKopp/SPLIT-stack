import { User } from '$models';

export class UserBase implements User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: Date | string;
    password: string;
    remember_token?: string;
    created_at?: Date | string;
    updated_at?: Date | string;


    constructor(data: User) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.email_verified_at = data.email_verified_at;
        this.password = data.password;
        this.remember_token = data.remember_token;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}