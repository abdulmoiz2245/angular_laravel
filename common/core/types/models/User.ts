import {Social} from './Social';
import {SocialProfile} from './SocialProfile';
import {Role} from './Role';
import {Permission} from '@common/core/types/models/permission';
import {Subscription} from '@common/shared/billing/models/subscription';

export const USER_MODEL = 'App\\User';

export interface User {
    id: number;
    display_name: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    permissions?: Permission[];
    email: string;
    password: string;
    api_token: string;
    language: string;
    timezone: string;
    country: string;
    created_at: string;
    updated_at: string;
    subscriptions?: Subscription[];
    confirmed: true;
    roles: Role[];
    social_profiles: SocialProfile[];
    has_password: boolean;
    oauth?: Social[];
    available_space: number | null;
}
