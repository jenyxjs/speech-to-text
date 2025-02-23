import { Component } from '../../lib/jenyx/components/Component/Component.js'

export class SpeechRecognition extends Component {
    constructor(options) {
        super({
            recognition: {
                class: window.SpeechRecognition || window.webkitSpeechRecognition,
            },
            lang: navigator.language,
            state: 'idle',
            isRun: false,
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
        this.recognition.onresult = event => this.update(event);

        this.recognition.onstart = () => this.state = 'running';
        this.recognition.onend = () => this.state = 'idle';
        this.recognition.onerror = () => this.state = 'error';

        this.recognition.onend = event => {
            this.isRun && setTimeout(() => this.recognition.start(), 100);
        }

        this.recognition.onerror = event => { 
            console.error('Recognition error:', event.error);
        }

        this.on('text', () => !this.text && this.restart());
        this.bind('isRun', this, 'restart', { run: true });
    };

    restart() {
        (this.state == 'running') && this.recognition.stop();
        (this.isRun && this.state != 'running') && this.recognition.start();

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