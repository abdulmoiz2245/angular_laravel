import {Person} from '../../../models/person';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {finalize, tap} from 'rxjs/operators';
import {ToggleGlobalLoader} from '../../../state/app-state-actions';
import {LoadPerson,LoadPersonMeta, SetPerson,ReloadPerson} from './person-state-actions';
import {PeopleService} from '../people.service';
import {Title} from '../../../models/title';
import {MetaTag} from '@common/core/meta/meta-tags.service';
import {Router} from '@angular/router';
import { Rating } from 'app/models/rating';


export interface PersonStateModel {
    loading: boolean;
    person?: Person;
    ratings?: Rating;
    avg_rating?:Rating;
    visibleSkills?:{};
    metaTags?: MetaTag[];
    overall_average?: Number[];
    knownFor?: Title[];
    person_meta?:any;
    credits?: {[key: string]: Title[]};
}

@State<PersonStateModel>({
    name: 'person',
    defaults: {
        loading: false,
        overall_average:[5],
        knownFor: [],
        metaTags: [],
        person_meta:[]
    }
})
export class PersonState {
    @Selector()
    static person(state: PersonStateModel) {
        return state.person;
    }

    @Selector()
    static loading(state: PersonStateModel) {
        return state.loading;
    }

    @Selector()
    static avg_rating(state: PersonStateModel) {
        return state.avg_rating;
    }

    @Selector()
    static person_meta(state: PersonStateModel) {
        return state.person.person_meta;
    }

    @Selector()
    static visibleSkills(state: PersonStateModel) {
        return state.visibleSkills;
    }

    @Selector()
    static ratings(state: PersonStateModel) {
        return state.ratings;
    }

    @Selector()
    static credits(state: PersonStateModel) {
        return state.credits;
    }

    @Selector()
    static creditsCount(state: PersonStateModel): number {
        return Object.keys(state.credits).map(department => {
            return state.credits[department].length;
        }).reduce((a, b) => a + b, 0);
    }

    @Selector()
    static knownFor(state: PersonStateModel) {
        return state.knownFor;
    }

    @Selector()
    static backdrop(state: PersonStateModel) {
        const titleWithBackdrop = state.knownFor.find(title => !!title.backdrop);
        return titleWithBackdrop ? titleWithBackdrop.backdrop : null;
    }

    constructor(
        private store: Store,
        private people: PeopleService,
        private router: Router,
    ) {}

    @Action(LoadPerson)
    loadPerson(ctx: StateContext<PersonStateModel>, action: LoadPerson) {
        const state = ctx.getState();

        if (state.person && state.person.id === action.personId) return;

        return this.people.get(action.personId).pipe(tap(response => {
            this.store.dispatch(new SetPerson(response));
        }));
    }

    @Action(LoadPersonMeta)
    loadPersonMeta(ctx: StateContext<PersonStateModel>, action: LoadPerson) {
        const state = ctx.getState();
        if (state.person && state.person.id === action.personId) return;
        return this.people.getMeta(action.personId).pipe(tap(response => {
            ctx.patchState({
                person: response.person,
                person_meta: response.person_meta,
            });
        }),
        finalize(() => ctx.patchState({loading: false}))
        );
    }

    @Action(ReloadPerson)
    reloadPerson(ctx: StateContext<PersonStateModel>, action: ReloadPerson) {

        ctx.patchState({
            loading: true
        });

        return this.people.get(action.personId).pipe(
            tap(response => {
                this.store.dispatch(new SetPerson(response));
            }),
            finalize(() => ctx.patchState({loading: false}))
        );

    }

    @Action(SetPerson)
    setPerson(ctx: StateContext<PersonStateModel>, action: SetPerson) {

        ctx.patchState({
            person: action.response.person,
            credits: action.response.credits,
            knownFor: action.response.knownFor,
            metaTags: action.response.seo,
            ratings: action.response.ratings,
            avg_rating: action.response.avg_rating,
            visibleSkills: action.response.visibleSkills,
        });
        this.store.dispatch(new ToggleGlobalLoader(false));
    }
}
