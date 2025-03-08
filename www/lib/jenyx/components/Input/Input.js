import { AbstractInput } from './AbstractInput.js';

export class Input extends AbstractInput {
    constructor(options) {
        super({
            tagName: options?.tagName || 'input',
            type: 'text',
            style: [                
                'width: 100%',                
                'padding: 0.5rem',
                'border: 1px solid #ccc',
            ],
            options
        });

        Input.init.call(this);
    }

    static async init() {
        this.bind('type', this.node, 'type');
    }
}
