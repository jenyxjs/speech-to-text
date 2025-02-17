import { AbstractInput } from '../../components/Input/AbstractInput.js';

export class Input extends AbstractInput {
    constructor (options) {
        super({
            tagName: options?.tagName || 'input',
            type: 'text',
            style: [
                'border-bottom: 1px solid var(--ax-grey-bg)'
            ],
            options
        });

        Input.init.call(this);
    }

    static async init () {
        this.bind('type', this.node, 'type');
    }
}