import { Control } from '../../components/Control/Control.js';

export class Label extends Control {
    constructor (options) {
        super({
            text: '',
            options
        });

        this.bind('text', this.node, 'innerHTML');
    }
}