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

    static async init () {
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

    update (event) {
        var transcript = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            var result = event.results[i];
            var sentence = result[0].transcript.trim();

            if (!transcript) {
                sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
            }
            

            if (result.isFinal) {
                this.transcripted += sentence + '. ';
            } else {
                const lastChar = this.transcripted[this.transcripted.length - 1];

                if (this.transcripted && lastChar != ' ') {
                    transcript += ' ' + sentence;
                } else {
                    transcript += sentence;
                }
            }
        }

        this.text = this.transcripted + transcript;
    }
};