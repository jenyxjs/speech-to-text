import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { Textarea } from '../../lib/jenyx/components/Input/Textarea.js';
import { IconButton } from '../Button/IconButton.js';
import { SpeechRecognition } from './SpeechRecognition.js';
import { MIC_SVG } from '../Assets/MIC_SVG.js';
import { COPY_SVG } from '../Assets/COPY_SVG.js';

export class SpeakArea extends Control {
    constructor(options) {
        super({
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
                            class: IconButton,
                            text: MIC_SVG,
                        },
                        copyButton: {
                            class: IconButton,
                            text: COPY_SVG,
                        },
                    },
                },
            },
            style: [
                'display: flex',
                'gap: 1rem',
                'font-family: monospace',
            ],
            options
        });

        this.options = {
            speechRecognition: {
                class: SpeechRecognition,
                inputNode: this.textArea.node,
            }
        };

        SpeakArea.init.call(this);
    }

    static init() {
        var { speechRecognition, textArea } = this;
        var { micButton, copyButton } = this.panel;

        speechRecognition.bind('isActive', this, 'refresh');
        speechRecognition.bind('finalText', this, 'refresh', { run: true });

        micButton.on('click', event => {
            speechRecognition.isActive = !speechRecognition.isActive;
            this.refresh();
        });

        copyButton.on('click', event => {
            navigator.clipboard.writeText(textArea.node.value);
            speechRecognition.reset();
            this.refresh();
        });
    }

    refresh() {
        var { micButton, copyButton } = this.panel;
        
        micButton.selected = this.speechRecognition.isActive;
        copyButton.selected = this.speechRecognition.isActive;
        
        copyButton.visible = this.textArea.node.value;
        micButton.visible = !copyButton.visible;
    }
}