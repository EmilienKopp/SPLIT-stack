import { WordPair } from './models.d';
export interface MatchingGame {
    id?: number;
    user_id: number;
    user?: User;
    created_at?: Date | string;
    updated_at?: Date | string;
    score: number;
    word_pairs?: WordPair[];
    results?: any[];
}

export interface Result {
    id?: number;
    matching_game_id: number;
    matching_game?: MatchingGame;
    score: number;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface WordPair {
    id?: number;
    source_word: string;
    target_word: string;
    source_language: string;
    target_language: string;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface MatchingGameWordPair {
    id?: number;
    matching_game_id: number;
    matching_game?: MatchingGame;
    word_pair_id: number;
    word_pair?: WordPair;
    created_at?: Date | string;
    updated_at?: Date | string;
}

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

export interface WordPair {

}

export type ModelTypes = MatchingGame | Organization | OrganizationUser | Project | ProjectUser | User | WordPair;