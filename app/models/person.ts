import {MEDIA_TYPE} from '../site/media-type';
import {Title} from './title';

export class Person {
    id: number;
    name: string;
    poster: string;
    known_for?: {};
    gender?: string;
    birth_date: string;
    death_date: string;
    birth_place: string;
    credits?: Title[];
    popular_credits?: Title[];
    person_meta?:[];
    description: string;
    skill_average: number;
    looks_average: number;
    overall_average: number;
    type: MEDIA_TYPE.PERSON;

    constructor(params: object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
