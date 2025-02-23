import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { Textarea } from '../Input/Textarea.js';
import { Button } from './Button.js';

export class Layout extends Control {
    constructor(options) {
        super({
            parentNode: document.body,
            children: {
                textArea: {
                    class: Textarea,
                    placeholder: 'Speak into the microphone',
                    style: [
                        'border-radius: 1em',
                        'padding: 1rem',
                        'margin: 1rem 0',
                        'background: var(--jn-primary)',
                        'border: 1px solid var(--jn-border)',
                    ]
                },
                bar: {
                    class: Control,
                    children: {
                        micButton: {
                            class: Button,
                        },
                        clearButton: {
                            class: Button,
                            text: 'Clear',
                        },
                        spacerBlock: {
                            class: Control,
                            style: ['flex-basis: 100%',],
                        },
                        copyButton: {
                            class: Button,
                            text: 'Copy',
                        },
                    },
                    style: [
                        'display: flex',
                        'gap: 1rem',
                    ],
                },
            },
            style: [
                'display: flex',
                'flex-direction: column',
                'font-family: monospace',
                'padding: 1rem',
            ],
            options
        });

        Layout.init.call(this);
    }

    static init() {
        app.speechRecognition.bind('text', this.textArea);
        app.speechRecognition.bind('isRun', this, 'refresh', { run: true });

        this.bar.micButton.on('click', event => {
            app.speechRecognition.isRun = !app.speechRecognition.isRun;
        });

        this.bar.clearButton.on('click', event => {
            app.speechRecognition.reset();
        });

        this.bar.copyButton.on('click', event => {
            navigator.clipboard.writeText(this.textArea.node.value);
            app.speechRecognition.reset();
        });
    }

    refresh() {
        this.bar.micButton.selected = app.speechRecognition.isRun;
        this.bar.micButton.text = app.speechRecognition.isRun ? 'Stop ' : 'Start';
    }
}
