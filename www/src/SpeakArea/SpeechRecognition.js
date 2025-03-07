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
            isFinal: false,
            currentState: 'stop',

            currentCursorPosition: 0,
            cursorPosition: 0,
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

        this.on('currentText', event => {
            if (this.isFinal) {
                this.finalText = this.currentText;
                console.log(this.finalText);
            }
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
            this.cursorPosition = 0;
            this.restart();
        }, 100);
    }

    update(event) {
        this.sentence = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            var result = event.results[i];
            var phrase = result[0].transcript.trim();

            this.isFinal = result.isFinal;
            this.updateSentence(phrase, result.isFinal);

            var part1 = this.finalText.slice(0, this.cursorPosition);
            var part2 = this.finalText.slice(this.cursorPosition);
            this.currentText = part1 + this.sentence + part2;

            if (this.isFinal) {
                this.finalText = this.currentText;
                this.cursorPosition = this.currentCursorPosition;
            }
        }
    }

    updateSentence(phrase) {
        var prevChar = this.finalText[this.cursorPosition - 2];
        var lastChar = this.finalText[this.cursorPosition - 1];
        var nextChar = this.finalText[this.cursorPosition];

        var isFirst =
            (lastChar == '.') ||
            lastChar === undefined ||
            (prevChar == '.' && lastChar == ' ');

        var text = this.sentence + (lastChar == ' ' ? `` : ` `) + phrase;
        text = text.toLowerCase().trim();

        if (isFirst) {
            var firctChar = text.charAt(0).toUpperCase();
            text = firctChar + text.slice(1).toLowerCase();
            this.sentence = (lastChar ? ' ' : '') + text;
        }

        if (this.isFinal && (nextChar === undefined || nextChar !== ' ')) {
            this.sentence += '.';
        } else if (this.isFinal) {
            this.sentence += '. ';
        }
    }
};

