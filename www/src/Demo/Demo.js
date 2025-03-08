import { Label } from '../../lib/jenyx/components/Label/Label.js';
import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { Textarea } from '../../lib/jenyx/components/Input/Textarea.js';
import { AbstractApp } from '../AbstractApp/AbstractApp.js'
import { InitCssTheme } from '../Css/InitCssTheme.js';
import { GoogleAnalytics } from '../GoogleAnalytics/GoogleAnalytics.js';
import { LinkButton } from '../Button/LinkButton.js';

export class App extends AbstractApp {
    constructor() {
        super({
            layout: {
                class: Control,
                parentNode: document.body,
                children: {
                    titleLabel: {
                        class: Label,
                        text: 'Speech to Text - Demo',
                        style: [
                            'font-size: 1.5rem',
                        ],
                    },
                    linkButton: {
                        class: LinkButton,
                        text: 'Download Chrome extension',
                        href: 'https://github.com/jenyxjs/speech-to-text',
                        style: [
                            'font-size: .75rem',
                        ],
                    },
                    textarea: {
                        class: Textarea,
                        placeholder: 'Textarea',
                        style: [
                            'display: flex',
                            'max-width: 32rem',
                            'border-radius: 1em',
                            'padding: 1rem',
                            'background: var(--jn-primary)',
                            'border: 1px solid var(--jn-border)',
                        ]
                    },
                },
                style: [
                    'padding: 1rem',
                    'display: flex',
                    'flex-direction: column',
                    'gap: 1rem',
                ]
            },
            initCssTheme: {
                class: InitCssTheme,
            },
            googleAnalytics: {
                class: GoogleAnalytics,
                id: 'G-ELXBKNLREG',
            },
        });
    }
}

new App();