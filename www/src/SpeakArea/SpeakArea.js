import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { SpeechRecognition } from './SpeechRecognition.js';
import { Textarea } from '../Input/Textarea.js';
import { Button } from '../App/Button.js';
import { MIC_SVG } from '../Assets/MIC_SVG.js';
import { COPY_SVG } from '../Assets/COPY_SVG.js';

export class SpeakArea extends Control {
    constructor(options) {
        super({
            empty: true,
            speechRecognition: {
                class: SpeechRecognition,
            },
            children: {
                textArea: {
                    class: Textarea,
                    placeholder: 'Speak into the microphone',
                    style: [
                        'display: flex',
                        'border-radius: 1em',
                        'padding: 1rem',
                        'background: var(--jn-primary)',
                        'border: 1px solid var(--jn-border)',
                    ]
                },
                panel: {
                    class: Control,
                    children: {
                        micButton: {
                            class: Button,
                            text: MIC_SVG,
                        },
                        copyButton: {
                            class: Button,
                            text: COPY_SVG,
                        },
                    },
                    style: [
                        'flex-direction: column',
                        'display: flex',
                        'gap: 1rem',
                    ],
                }
            },
            style: [
                'display: flex',
                'gap: 1rem',
                'font-family: monospace',
            ],
            options
        });

        SpeakArea.init.call(this);
    }

    static init() {
        this.speechRecognition.bind('text', this.textArea);
        this.speechRecognition.bind('isActive', this, 'refresh');
        this.textArea.bind('text', this, 'refresh', { run: true });

        this.panel.micButton.on('click', event => {
            this.speechRecognition.isActive = !this.speechRecognition.isActive;
            this.refresh();
        });

        this.panel.copyButton.on('click', event => {
            navigator.clipboard.writeText(this.textArea.node.value);
            this.speechRecognition.restart();
        });
    }

    refresh() {
        var text = this.textArea.node.value;

        this.panel.micButton.visible = !text;
        this.panel.micButton.selected = this.speechRecognition.isActive;

        this.panel.copyButton.visible = text;
        this.panel.copyButton.selected = this.speechRecognition.isActive;
    }
}
