import {Injectable} from '@angular/core';
import {MEDIA_TYPE} from '../media-type';
import {Rating} from '../../models/rating';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {BackendResponse} from '@common/core/types/backend-response';

interface CreateRatingPayload {
    mediaId: number;
    mediaType: MEDIA_TYPE.EPISODE | MEDIA_TYPE.TITLE;
    score: number;
    review?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RatingService {
    constructor(private http: AppHttpClient) {}

    public getAll(params: {titleId?: number, withTextOnly?: boolean, limit?: number}): PaginatedBackendResponse<Rating> {
        return this.http.get('ratings', params);
    }

    public get(params: {titleId?: number}): PaginatedBackendResponse<Rating> {
        return this.http.get('ratings', params);
    }



    public create(params: CreateRatingPayload): BackendResponse<{review: Rating}> {
        return this.http.post('ratings', params);
    }

    public update(id: number, payload: Partial<Rating>): BackendResponse<{review: Rating}> {
        return this.http.put('ratings/' + id, payload);
    }

    public delete(ids: number[]) {
        return this.http.delete('ratings', {ids});
    }
}
