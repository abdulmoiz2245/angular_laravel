import {Injectable} from '@angular/core';
import {Person} from '../../models/person';
import {PersonFilters} from '../../models/personFilters';
import {Title} from '../../models/title';
import {MetaTag} from '@common/core/meta/meta-tags.service';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {BackendResponse} from '@common/core/types/backend-response';
import { Rating } from 'app/models/rating';

export interface GetPersonResponse {
    person: Person;
    ratings: Rating;
    avg_rating:Rating;
    visibleSkills:{};
    knownFor: Title[];
    person_meta:[];
    credits: {[key: string]: Title[]};
    seo?: MetaTag[];
}

@Injectable({
    providedIn: 'root'
})
export class PeopleService {
    constructor(private http: AppHttpClient) {}

    public getAll(params: PersonFilters): PaginatedBackendResponse<Person> {
        return this.http.get('people', params);
    }

    public get(id: number): BackendResponse<GetPersonResponse> {
        return this.http.get('people/' + id);
    }

    public getMeta(id: number): BackendResponse<GetPersonResponse> {
        return this.http.get('people_meta/' + id);
    }

    public create(payload: Partial<Person>): BackendResponse<{person: Person}> {
        return this.http.post('people', payload);
    }

    public suggestMessage(message: String,link: String,slug:String): BackendResponse<{person: Person}> {
        return this.http.get('people/mail/'+message+'/'+link+'/'+slug);
    }

    public update(id: number, payload: Partial<Person>): BackendResponse<{person: Person}> {
        return this.http.put('people/' + id, payload);
    }

    public updateMeta(id: number, payload: any): BackendResponse<{person: Person}> {
        return this.http.put('people_meta/' + id, payload);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.http.delete('people', {ids});
    }
}
