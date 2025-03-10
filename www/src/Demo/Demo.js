import { AbstractApp } from '../AbstractApp/AbstractApp.js'
import { InitCssTheme } from '../Css/InitCssTheme.js';
import { GoogleAnalytics } from '../GoogleAnalytics/GoogleAnalytics.js';
import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { Label } from '../../lib/jenyx/components/Label/Label.js';
import { LinkButton } from '../Button/LinkButton.js';
import { Input } from '../../lib/jenyx/components/Input/Input.js';
import { Textarea } from '../../lib/jenyx/components/Input/Textarea.js';
import { SpeechRecognition } from './SpeechRecognition.js';
import { TitleLabel } from './TitleLabel.js';

export class App extends AbstractApp {
    constructor() {

        var inputStyle = [
            'display: flex',
            'max-width: 36rem',
            'border-radius: 1em',
            'padding: 1rem',
            'background: var(--jn-primary)',
            'border: 1px solid var(--jn-border)',
        ];

        super({
            layout: {
                class: Control,
                parentNode: document.body,
                children: {
                    titleLabel: {
                        class: Label,
                        text: 'Jenyx Speech to Text - Demo',
                        style: ['font-size: 1.5rem',],
                    },
                    linkButton: {
                        class: LinkButton,
                        text: 'Download Chrome extension',
                        href: 'https://github.com/jenyxjs/speech-to-text',
                        style: ['font-size: .9rem', 'margin-top: 1rem',],
                    },

                    textareaTitle: { class: TitleLabel, text: 'Textarea', },
                    textarea: { class: Textarea, style: inputStyle },

                    inputTitle: { class: TitleLabel, text: 'Input', },
                    input: { class: Input, style: inputStyle },

                },
                style: [
                    'display: flex',
                    'flex-direction: column',
                    'gap: .5rem',
                    'padding: 1rem',
                ]
            },
            initCssTheme: {
                class: InitCssTheme,
            },
            googleAnalytics: {
                class: GoogleAnalytics,
                id: 'G-ELXBKNLREG',
            },
            speechRecognition: {
                class: SpeechRecognition,
            }
        });
        App.init.call(this);
    }

    static init() {
        document.addEventListener('focusin', (event) => {
            if (this.isInputElement(event.target)) {
                this.attachInput(event.target);
            }
        });
    }

    isInputElement(target) {
        const tagName = target.tagName.toLowerCase();
        return tagName === 'input' || tagName === 'textarea' // || target.isContentEditable;
    }

    attachInput(target) {
        this.speechRecognition.inputNode = target;
        this.speechRecognition.finalText = target.value;
        this.speechRecognition.updatePosition();

        if (this.speechRecognition.isActive) {
            this.speechRecognition.restart();
        } else {
            this.speechRecognition.isActive = true;
        }
    }
}

new App();