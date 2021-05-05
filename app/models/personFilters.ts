import {MEDIA_TYPE} from '../site/media-type';
import {Title} from './title';

export class PersonFilters {
    perPage?: number;
    page?: number;
    topRated?: boolean;
    recentlyRated?: boolean;
    mostPopular?:boolean;
    order?: string;
    title_type?: string;
    title_search?: string;
    death?: string;
    birthday?: string;
    age?: string;
    gender?: string;
    ratings?: string;
    skills?: string;
    looks?: string;
    country?: string;
    profession?: string;

    constructor(params: object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
