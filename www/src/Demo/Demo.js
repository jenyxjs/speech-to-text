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
                        text: 'Jenyx Speech to Text<br>Demonstration',
                        style: ['font-size: 1.5rem',],
                    },

                    textareaTitle: { class: TitleLabel, text: 'Textarea', },
                    textarea: { class: Textarea, style: inputStyle },

                    inputTitle: { class: TitleLabel, text: 'Input', },
                    input: { class: Input, style: inputStyle },

                    linkButton: {
                        class: LinkButton,
                        text: 'Download Chrome extension',
                        href: 'https://github.com/jenyxjs/speech-to-text',
                        style: ['font-size: 1rem', 'margin-top: 1rem',],
                    },

                },
                style: [
                    'display: flex',
                    'flex-direction: column',
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
                this.speechRecognition.inputNode = event.target;
            }
        });
    }

    isInputElement(target) {
        var tagName = target.tagName.toLowerCase();
        return tagName === 'input' || tagName === 'textarea';
    }
}

new App();