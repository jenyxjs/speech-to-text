import { AbstractInput } from './AbstractInput.js';

export class Textarea extends AbstractInput {
    constructor(options) {
        super({
            tagName: 'textarea',
            style: [
                'resize: none',
                'overflow-y: hidden',
            ],
            options
        });

        Textarea.init.call(this);
    }

    static async init() {
        ['focus', 'input', 'cut', 'paste'].forEach(value => {
            this.node.addEventListener(value, this.auroresize.bind(this));
        });

        this.on('text', this.auroresize.bind(this));
    }

    auroresize() {
        this.node.style.height = 'auto';
        this.node.style.height = this.node.scrollHeight + 'px';
    }
}