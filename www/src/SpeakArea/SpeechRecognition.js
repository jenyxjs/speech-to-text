import { Component } from '../../lib/jenyx/components/Component/Component.js'

export class SpeechRecognition extends Component {
    constructor(options) {
        super({
            recognition: {
                class: window.SpeechRecognition || window.webkitSpeechRecognition,
            },
            lang: navigator.language,
            isRun: false,
            state: 'stop',
            text: '',
            finalTranscript: '',
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
            this.state = 'start';
        });

        this.recognition.addEventListener('end', event => {
            this.state = 'stop';
            this.isRun && setTimeout(() => this.recognition.start(), 100);
        });

        this.on('text', () => !this.text && this.restart());
        this.bind('isRun', this, 'restart', { run: true });
    };

    async restart() {
        if (this.state == 'start') {
            this.recognition.stop();
        } else {
            this.isRun && setTimeout(() => this.recognition.start(), 100);
        }

        this.finalTranscript = '';
        this.text = '';
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
                this.finalTranscript += sentence + '. ';
            } else  {
                transcript += ' ' + sentence;
            }
        }

        this.text = this.finalTranscript + transcript;
    }
};