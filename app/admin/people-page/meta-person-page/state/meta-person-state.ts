import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Person} from '../../../../models/person';
import {finalize, tap} from 'rxjs/operators';
import {CreatePerson, LoadPerson,LoadPersonMeta, ResetState, UpdatePerson, UpdatePersonMeta} from './meta-person-state-actions';
import {PeopleService} from '../../../../site/people/people.service';

interface MetaPersonStateModel {
    person: Person;
    loading: boolean;
    person_meta: [];
}

@State<MetaPersonStateModel>({
    name: 'metaPerson',
    defaults: {
        person: new Person(),
        loading: false,
        person_meta:[]
    },
})
export class MetaPersonState {
    @Selector()
    static person(state: MetaPersonStateModel) {
        return state.person;
    }

    @Selector()
    static loading(state: MetaPersonStateModel) {
        return state.loading;
    }

    @Selector()
    static person_meta(state: MetaPersonStateModel) {
        return state.person_meta;
    }

    constructor(
        private people: PeopleService
    ) {}


    @Action(LoadPersonMeta)
    loadPersonMeta(ctx: StateContext<MetaPersonStateModel>, action: LoadPersonMeta) {
        ctx.patchState({loading: true});
        return this.people.getMeta(action.id).pipe(tap(response => {
            ctx.patchState({
                person: response.person,
                person_meta: response.person_meta,
                loading: false,
            });
        }));
    }


    @Action(UpdatePersonMeta)
    updatePersonMeta(ctx: StateContext<MetaPersonStateModel>, action: UpdatePersonMeta) {
        ctx.patchState({loading: true});
        return this.people.updateMeta(ctx.getState().person.id, action.payload).pipe(
            finalize(() => ctx.patchState({loading: false})),
            tap(response => ctx.patchState({person: response.person}))
        );
    }

}
