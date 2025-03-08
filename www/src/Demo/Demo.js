import { Label } from '../../lib/jenyx/components/Label/Label.js';
import { Button } from '../../lib/jenyx/components/Button/Button.js';
import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { Textarea } from '../../lib/jenyx/components/Input/Textarea.js';
import { Input } from '../../lib/jenyx/components/Input/Input.js';
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
                        text: 'Jenyx Speech to Text - Demo',
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
                    input: {
                        class: Input,
                        placeholder: 'Input text',
                        style: [
                            'display: flex',
                            'max-width: 32rem',
                            'border-radius: 1em',
                            'padding: 1rem',
                            'background: var(--jn-primary)',
                            'border: 1px solid var(--jn-border)',
                        ]
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
                    pmarea: {
                        class: Control,
                        style: [
                            'display: flex',
                            'max-width: 32rem',
                            'border-radius: 1em',
                            'padding: 0 1rem',
                            'background: var(--jn-primary)',
                            'border: 1px solid var(--jn-border)',
                        ],
                    },
                    button: {
                        class: Button,
                        text: 'Button',
                        onclick: event => {
                            const jsonContent = app.view.state.doc.toJSON();
                            console.log("JSON Content:", jsonContent);

                            const textContent = app.view.state.doc
                                .textBetween(0, app.view.state.doc.content.size, '\n');
                            console.log(textContent);
                        }
                    }
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

        const state = PM.state.EditorState.create(
            { schema: PM.schema_basic.schema, }
        );

        app.view = new PM.view.EditorView(this.layout.pmarea.node, { state });
    }
}

new App();
