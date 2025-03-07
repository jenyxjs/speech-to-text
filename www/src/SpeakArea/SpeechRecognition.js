import { Component } from '../../lib/jenyx/components/Component/Component.js'

export class SpeechRecognition extends Component {
    constructor(options) {
        super({
            currentText: '',
            lang: navigator.language,

            recognition: {
                class: window.SpeechRecognition || window.webkitSpeechRecognition,
            },

            isActive: false,
            currentState: 'stop',

            carriagePosition: 0,
            finalText: '',
            sentence: '',

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
            this.restart();
        });

        this.bind('isActive', this, 'restart', { run: true });
    };

    async restart() {
        if (this.currentState == 'start') {
            this.recognition.stop();
        } else {
            this.isActive && setTimeout(() => {
                this.recognition.start();
            }, 100);
        }
    }

    reset() {
        this.isActive && setTimeout(() => {
            this.finalText = '';
            this.currentText = '';
            this.carriagePosition = 0;
            this.restart();
        }, 100);
    }

    update(event) {
        this.sentence = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            var result = event.results[i];
            var phrase = result[0].transcript.trim();

            this.updateText(phrase);
            this.currentText = this.finalText + this.sentence;

            if (result.isFinal) {
                var nextChar = this.finalText[this.carriagePosition];

                if (nextChar === undefined || nextChar !== ' ') {
                    this.currentText += '.';
                }

                this.finalText = this.currentText;
                this.carriagePosition = this.finalText.length;
                console.log('finalText', this.carriagePosition, this.finalText);
            }
        }
    }

    updateText(phrase) {
        var prevChar = this.finalText[this.carriagePosition - 2];
        var lastChar = this.finalText[this.carriagePosition - 1];

        var isFirst =
            (lastChar == '.') ||
            lastChar === undefined ||
            (prevChar == '.' && lastChar == ' ');

        var text = this.sentence + (this.sentence ? ` ` : ``) + phrase;
        text = text.toLowerCase().trim();

        if (isFirst) {
            var firctChar = text.charAt(0).toUpperCase();
            text = firctChar + text.slice(1).toLowerCase();
            this.sentence = (lastChar ? ' ' : '') + text;
        }
    }
};

