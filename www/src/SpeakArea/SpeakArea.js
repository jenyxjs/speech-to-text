import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { SpeechRecognition } from './SpeechRecognition.js';
import { Textarea } from '../Input/Textarea.js';
import { Button } from '../App/Button.js';
import { MIC_SVG } from '../Assert/MIC_SVG.js';
import { COPY_SVG } from '../Assert/COPY_SVG.js';
import { OFF_SVG } from '../Assert/OFF_SVG.js';

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
                        offButton: {
                            class: Button,
                            text: OFF_SVG,
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
        this.speechRecognition.bind('isRun', this, 'refresh');
        this.textArea.bind('text', this, 'refresh', { run: true });

        this.panel.micButton.on('click', event => {
            this.speechRecognition.isRun = true;
        });

        this.panel.offButton.on('click', event => {
            this.speechRecognition.isRun = false;
        });

        this.panel.copyButton.on('click', event => {
            navigator.clipboard.writeText(this.textArea.node.value);
            this.speechRecognition.restart();
        });
    }

    refresh() {
        var text = this.textArea.node.value;
        this.panel.micButton.visible = !this.speechRecognition.isRun;
        this.panel.offButton.visible = this.speechRecognition.isRun && !text;
        this.panel.copyButton.visible = text;
    }
}
