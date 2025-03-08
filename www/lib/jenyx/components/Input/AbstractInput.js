import { Control } from '../Control/Control.js';

export class AbstractInput extends Control {
    constructor(options) {
        super({
            tagName: options?.tagName || 'input',
            text: '',
            placeholder: '',
            keyupChange: false,
            style: [
                'font-family: inherit',
                'background: inherit',
                'color: inherit',
                'outline: none',
                'box-sizing: border-box',
                'width: 100%',
                'border: 0',
            ],
            options
        });

        AbstractInput.init.call(this);
    }

    static async init() {
        this.bind('text', this.node, 'value');
        this.bind('placeholder', this.node, 'placeholder');

        this.node.tabIndex = 0;

        this.node.addEventListener('change', event => {
            this.text = this.node.value;
        });

        this.node.addEventListener('input', event => {
            this.text = this.node.value;
            this.emit('input', this.node.value);
        });

        this.node.addEventListener('keyup', event => {
            if (this.keyupChange) {
                this.text = this.node.value;
            }

            if (event.keyCode == 13) {
                this.emit('enter');
                this.node.click();
            } else if (event.keyCode == 9 && this.node == document.activeElement) {
                this.node.style.outline = 'auto';
            }
        });

        this.node.addEventListener('blur', event => {
            this.node.style.outline = 'none';
            this.emit('blur');
        });

        this.node.addEventListener('focus', event => {
            this.emit('focus');
        });
    }

    focus() {
        setTimeout(this.node.focus.bind(this.node));
    };
}