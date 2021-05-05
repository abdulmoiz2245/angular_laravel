import {MEDIA_TYPE} from '../site/media-type';
import {User} from '../../common/core/types/models/User';

export class Rating {
    id?: number;
    score?: number;
    forhead?: number;
    eyes?: number;
    nose?: number;
    cheeks?: number;
    lips?: number;
    chin?: number;
    face?: number;
    acting?: number;
    voice?: number;    
    direction?: number;    
    modelling?: number;    
    influencer?: number;    
    skill_average?: number;    
    looks_average?: number;    
    overall_average?: number;    
    count?: number;    
    media_type?: MEDIA_TYPE.EPISODE|MEDIA_TYPE.MOVIE;
    reviewable_id?: number;
    user_id?: number;
    link?: string;
    user?: User;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
