import { Component } from '../../lib/jenyx/components/Component/Component.js'
import { Control } from '../../lib/jenyx/components/Control/Control.js';
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
            speechRecognition.restart();
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

class SpeechRecognition extends Component {
    constructor(options) {
        super({
            recognition: {
                class: window.SpeechRecognition || window.webkitSpeechRecognition,
            },
            lang: navigator.language,
            isActive: false,
            currentState: 'stop',
            carriagePosition: 0,
            currentText: '',
            transcripted: '',
            options
        });

        this.recognition.interimResults = true;
        this.recognition.continuous = true;
        this.bind('lang', this.recognition);

        SpeechRecognition.init.call(this);
    }

    static async init() {
        this.recognition.addEventListener('result', event => {
            this.update(event);
        });

        this.recognition.addEventListener('start', event => {
            this.currentState = 'start';
        });

        this.recognition.addEventListener('end', event => {
            this.currentState = 'stop';
            this.start();
        });

        this.bind('isActive', this, 'restart', { run: true });
    };

    async restart() {
        if (this.currentState == 'start') {
            this.recognition.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.isActive && setTimeout(() => {
            this.transcripted = '';
            this.currentText = '';
            this.carriagePosition = 0;
            this.recognition.start();
        }, 100);
    }

    update(event) {
        var sentence = '';
        
        for (var i = event.resultIndex; i < event.results.length; i++) {
            var result = event.results[i];
            var newText = result[0].transcript.trim();
            
            if (!sentence) {
                newText = newText.charAt(0).toUpperCase() + newText.slice(1);
            }
            
            if (result.isFinal && newText) {
                var space = this.transcripted ? ` ` : ``;
                this.transcripted += space + newText + '.';

                this.currentText = this.transcripted;
                this.emit('finalText', newText);
            } else {
                sentence += (sentence ? ` ` : ``) + newText;
                this.insertTextToCarriagePosition(sentence);
                this.emit('tmpText', sentence);
            }
        }
    }

    insertTextToCarriagePosition(sentence) {
        var outerSpace = this.transcripted ? ` ` : ``;
        this.currentText = this.transcripted + outerSpace + sentence;
    }
};