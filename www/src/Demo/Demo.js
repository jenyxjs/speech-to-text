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

        var titleStyle = [
            'margin-top: 2rem',
            'font-size: 0.9rem',
        ];

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
                        style: [
                            'font-size: 1.5rem',
                        ],
                    },
                    linkButton: {
                        class: LinkButton,
                        text: 'Download Chrome extension',
                        href: 'https://github.com/jenyxjs/speech-to-text',
                        style: [
                            'font-size: .9rem',
                            'margin-top: 1rem',
                        ],
                    },
                    textareaTitle: {
                        class: Label,
                        text: 'Textarea',
                        style: titleStyle
                    },
                    textarea: {
                        class: Textarea,
                        style: inputStyle
                    },
                    inputTitle: {
                        class: Label,
                        text: 'Input',
                        style: titleStyle
                    },
                    input: {
                        class: Input,
                        style: inputStyle
                    },
                    pmTitle: {
                        class: Label,
                        text: 'ProseMirror',
                        style: titleStyle
                    },
                    pm: {
                        class: Control,
                        style: inputStyle.join(';') + ';padding: 0 1rem',
                    }
                },
                style: [
                    'padding: 1rem',
                    'display: flex',
                    'flex-direction: column',
                    'gap: .5rem',
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


        App.init.call(this);
    }

    static init() {
        this.initpm();
    }

    initpm() {
        var view = new PM.view.EditorView(this.layout.pm.node, {
            state: PM.state.EditorState.create(
                { schema: PM.schema_basic.schema, }
            )
        });

        // console.log(view.state.doc.textBetween(
        //     0, view.state.doc.content.size, '\n'
        // ));
        //console.log("JSON Content:", view.state.doc.toJSON());
    }
}

new App();
