import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'chip-input',
    templateUrl: './chip-input.component.html',
    styleUrls: ['./chip-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: ChipInputComponent,
        multi: true,
    }]
})
export class ChipInputComponent implements ControlValueAccessor {
    @Input() placeholder: string;
    @Input() type = 'text';

    public propagateChange: Function;
    public items$ = new BehaviorSubject<string[]>([]);

    public remove(index: number) {
        const items = [...this.items$.value];
        items.splice(index, 1);
        this.items$.next(items);
        this.propagateChange(this.items$.value);
    }

    public add(value: string, propagate = true) {
        value = value ? value.trim() : '';
        const duplicate = this.items$.value.indexOf(value) > -1;
        if (value && !duplicate) {
            this.items$.next([...this.items$.value, value]);
            if (propagate) {
                this.propagateChange(this.items$.value);
            }
        }
    }

    public writeValue(value: string[] = []) {
        if (value && value.length) {
            value.forEach(item => this.add(item, false));
        } else if (this.items$.value.length) {
            while (this.items$.value.length !== 0) {
                this.remove(0);
            }
        }
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {
    }
}
