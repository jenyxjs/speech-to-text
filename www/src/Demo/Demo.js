import { Label } from '../../lib/jenyx/components/Label/Label.js';
import { Button } from '../../lib/jenyx/components/Button/Button.js';
import { Control } from '../../lib/jenyx/components/Control/Control.js';
import { Textarea } from '../../lib/jenyx/components/Input/Textarea.js';
import { Input } from '../../lib/jenyx/components/Input/Input.js';
import { AbstractApp } from '../AbstractApp/AbstractApp.js'
import { InitCssTheme } from '../Css/InitCssTheme.js';
import { GoogleAnalytics } from '../GoogleAnalytics/GoogleAnalytics.js';
import { LinkButton } from '../Button/LinkButton.js';
import { SpeechRecognition } from '../SpeakArea/SpeechRecognition.js';

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
            speechRecognition: {
                class: SpeechRecognition,
            }
        });
        App.init.call(this);
    }


    static init() {
        this.initpm();

        document.addEventListener('focusin', (event) => {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea' ||
                target.isContentEditable
            ) {
                this.inputFocus(target);
            }
        });
    }
/**
           .ProseMirror {
            outline: none;
        }
            <script src="lib/prosemirror/prosemirror.js"></script>
*/
/*
ПРОМТ:
1. Отвечай только кодом без пояснений.
2. Пользователь ожитает, что код между START и STOP может быть улучшен.
*/
    // START
    // STOP
    
    inputFocus(target) {
        const sr = this.speechRecognition;
        sr.inputNode = target;
        sr.finalText = target.value;
        sr.updatePosition();

        if (sr.isActive) {
            sr.restart();
        } else {
            sr.isActive = true;
        }
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
