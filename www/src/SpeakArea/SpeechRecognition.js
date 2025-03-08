import { AbstractInput } from '../../lib/jenyx/components/Input/AbstractInput.js';

export class SpeechRecognition extends AbstractInput {
    constructor(options) {
        super({
            inputNode: null,
            lang: navigator.language,

            inputCursorPosition: 0,
            cursorPosition: 0,

            sentence: '',
            finalText: '',

            isFinal: false,
            isActive: false,
            currentState: 'stop',

            recognition: {
                class: window.SpeechRecognition
                    || window.webkitSpeechRecognition,
            },
            options
        });

        this.recognition.interimResults = true;
        this.recognition.continuous = true;
        this.bind('lang', this.recognition);

        SpeechRecognition.init.call(this);
    }

    static async init() {
        this.recognitionInit();
        this.inputInit();
    };

    async inputInit() {
        await this.wait('inputNode');

        this.inputNode.addEventListener('selectionchange', () => {
            this.inputCursorPosition = this.inputNode.selectionStart;

            if (this.isFinal) {
                this.finalText = this.inputNode.value;
            }
        });

        this.inputNode.addEventListener('click', () => {
            this.cursorPosition = this.inputNode.selectionStart;
        });

        this.inputNode.addEventListener('keyup', () => {
            this.cursorPosition = this.inputNode.selectionStart;
        });
    }

    recognitionInit() {
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
    }

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
        this.finalText = '';
        this.inputNode.value = '';
        this.cursorPosition = 0;
        this.restart();
    }

    update(event) {
        this.sentence = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            var result = event.results[i];
            this.isFinal = result.isFinal;
            var phrase = result[0].transcript.trim();

            this.sentence = this.getSentence(phrase);
            this.insertText();
            this.updateSelectionRange();

            if (this.isFinal) {
                this.finalText = this.inputNode.value;
                this.cursorPosition += this.sentence.length;
            }
        }
    }

    updateSelectionRange() {
        var position = this.cursorPosition + this.sentence.length;
        this.inputNode.setSelectionRange(position, position);
    }

    insertText() {
        var start = this.inputNode.selectionStart;
        var end = this.inputNode.selectionEnd;
        this.finalText = this.finalText.slice(0, start) +
            this.finalText.slice(end);

        var part1 = this.finalText.slice(0, this.cursorPosition);
        var part2 = this.finalText.slice(this.cursorPosition);
        var point = this.isUpper ? '. ' : ' ';

        var text = part1 + this.sentence + point + part2
        this.inputNode.value = text.replace(/\s{2,}/g, ' ').trim();
    }

    getSentence(phrase) {
        var text = (this.sentence + ` ` + phrase).toLowerCase().trim();

        if (this.isUpper) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        return ' ' + text;
    }

    get isUpper() {
        var part = this.finalText.slice(0, this.cursorPosition).trim();
        var lastChar = part[part.length - 1];
        return !lastChar || lastChar == '.';
    }
}