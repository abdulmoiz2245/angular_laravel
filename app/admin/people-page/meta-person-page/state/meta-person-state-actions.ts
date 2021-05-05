import {Person} from '../../../../models/person';

export class LoadPerson {
    static readonly type = '[CrupdatePerson] Load Person';
    constructor(public id: number) {}
}

export class LoadPersonMeta {
    static readonly type = '[MetaPerson] Load Meta Person';
    constructor(public id: number) {}
}

export class CreatePerson {
    static readonly type = '[CrupdatePerson] Create Person';
    constructor(public payload: Partial<Person>) {}
}

export class UpdatePerson {
    static readonly type = '[CrupdatePerson] Update Person';
    constructor(public payload: Partial<Person>) {}
}

export class UpdatePersonMeta {
    static readonly type = '[MetaPerson] Update Meta Person';
    constructor(public payload: any) {}
}

export class ResetState {
    static readonly type = '[CrupdatePerson] Reset State';
}
