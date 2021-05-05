import {GetPersonResponse} from '../people.service';

export class LoadPerson {
    static readonly type = '[Person] Load';
    constructor(public personId: number) {}
}

export class LoadPersonMeta {
    static readonly type = '[Person] Load';
    constructor(public personId: number) {}
}

export class ReloadPerson {
    static readonly type = '[Person] Reload';
    constructor(public personId: number,public overall_average: number) {}
}

export class SetPerson {
    static readonly type = '[Title] Set Person';
    constructor(public response: GetPersonResponse) {}
}
