import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { Textarea } from '../Input/Textarea.js';
import { Button } from '../App/Button.js';
import { MIC_SVG } from '../Assets/MIC_SVG.js';
import { COPY_SVG } from '../Assets/COPY_SVG.js';
import { SpeechRecognition } from './SpeechRecognition.js';

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
        var { speechRecognition, textArea } = this;
        var { micButton, copyButton } = this.panel;

        textArea.bind('text', this, 'refresh');
        speechRecognition.bind('isActive', this, 'refresh', { run: true });

        micButton.on('click', event => {
            speechRecognition.isActive = !speechRecognition.isActive;
            this.refresh();
        });

        copyButton.on('click', event => {
            navigator.clipboard.writeText(textArea.node.value);
            speechRecognition.reset();
        });

        speechRecognition.bind('currentText', textArea, 'text');
    }

    refresh() {
        var { micButton, copyButton } = this.panel;
        var text = this.textArea.node.value;

        micButton.visible = !text;
        micButton.selected = this.speechRecognition.isActive;

        copyButton.visible = text;
        copyButton.selected = this.speechRecognition.isActive;
    }
}