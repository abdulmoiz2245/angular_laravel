export class MenuItem {
    id: number;
    label: string;
    action: string;

    // ID for model if action matches to specific model. If action
    // points to a specific custom page, model_id will be that page's ID.
    model_id: number;
    type = 'link';
    order = 1;
    icon: string;
    condition: string|Function = null;
    target: string = null;
    position = 0;
    activeExact = false;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }

        this.id = Math.floor(Math.random() * (1000 - 1));
    }
}
