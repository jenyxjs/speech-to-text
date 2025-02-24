import { Component } from '../../lib/jenyx/components/Component/Component.js'

export class SpeechRecognition extends Component {
    constructor(options) {
        super({
            recognition: {
                class: window.SpeechRecognition || window.webkitSpeechRecognition,
            },
            lang: navigator.language,
            isActive: false,
            currentState: 'stop',
            transcripted: '',
            text: '',
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
            this.text = '';
            this.recognition.start();
        }, 100);
    }

    update(event) {
        var sentence = '';
        var space = this.transcripted ? ` ` : ``;

        for (var i = event.resultIndex; i < event.results.length; i++) {
            var result = event.results[i];
            var newText = result[0].transcript.trim();

            if (!sentence) {
                newText = newText.charAt(0).toUpperCase() + newText.slice(1);
            }

            if (result.isFinal) {
                this.transcripted += space + newText + '.';
            } else {
                let space = this.sentence ? ` ` : ``;
                sentence += space + newText;
                console.log(sentence);
            }
        }

        this.text = this.transcripted + space + sentence;
    }
};