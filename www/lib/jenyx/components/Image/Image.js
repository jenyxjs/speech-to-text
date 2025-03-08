import { Control } from '../Control/Control.js';

export class Image extends Control {
    constructor (options) {
        super({
            tagName: 'img',
            loading: 'auto', // lazy || eager || auto 
            src: '',
            options
        });

        this.bind('loading', this.node, 'loading');
        this.bind('src', this.node, 'src');
    }
}