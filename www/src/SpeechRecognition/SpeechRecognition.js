import { Component } from '../../lib/jenyx/components/Component/Component.js'

export class SpeechRecognition extends Component {
    constructor(options) {
        super({
            recognition: null,
            lang: navigator.language,
            isRun: false,
            text: '',
            finalTranscript: '',
            options
        });

        SpeechRecognition.init.call(this);
    }

    static async init () {
        this.recognition = new (
            window.SpeechRecognition || window.webkitSpeechRecognition
        )();

        this.bind('lang', this.recognition);
        this.recognition.interimResults = true;
        this.recognition.continuous = true;

        this.recognition.onresult = event => this.updateResult(event);
        this.recognition.onend = () => this.updateEnd();
        this.recognition.onerror = event => console.error('Recognition error:', event.error);

        this.bind('isRun', this, 'updateRun', { run: true });
        this.on('text', event => {
            !this.text && this.reset()
        }, { run: true });
    };

    reset() {
        this.finalTranscript = '';
        this.text = ''; 
    }

    updateRun () {
        if (this.isRun && this.recognition && this.recognition.state !== 'running') {
            this.recognition.start();
        } else if (!this.isRun) {
            this.recognition.stop();
        }
    }

    updateEnd () {
        if (this.isRun) {
            setTimeout(() => this.recognition.start(), 100);
        }
    }

    updateResult (event) {
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