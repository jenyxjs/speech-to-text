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

        this.on('inputNode', event => {
            this.inputInit();
        }, { run: true });
    };

    async inputInit() {
        await this.wait('inputNode');

        this.reset()

        this.inputNode.addEventListener('selectionchange', () => {
            this.updatePosition();
        });

        this.inputNode.addEventListener('click', () => {
            this.cursorPosition = this.inputNode.selectionStart;
        });

        this.inputNode.addEventListener('keyup', () => {
            this.cursorPosition = this.inputNode.selectionStart;
        });
        
        this.finalText = this.inputNode.value;
    }

    updatePosition() {
        this.inputCursorPosition = this.inputNode.selectionStart;

        if (this.isFinal) {
            this.finalText = this.inputNode.value;
        }
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

    async restart(isActive) {
        if (this.currentState == 'start') {
            this.recognition.stop();
        } else {
            this.isActive && setTimeout(() => {
                this.recognition.start();
            }, 100);
        }
    }

    reset() {
        this.sentence = '';
        this.cursorPosition = 0;
        this.inputCursorPosition = 0;
        this.updatePosition();
    }

    clear() {
        this.finalText = '';
        this.inputNode.value = '';
    }

    update(event) {
        this.sentence = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            var result = event.results[i];
            this.isFinal = result.isFinal;
            var phrase = result[0].transcript.trim();

            this.sentence = this.getSentence(phrase);
            this.inputNode.value = this.getText();

            var position = this.cursorPosition + this.sentence.length;
            this.inputNode?.setSelectionRange(position, position);

            if (this.isFinal) {
                this.finalText = this.inputNode.value;
                this.cursorPosition += this.sentence.length + 1;
            }
        }
    }

    getText() {
        var start = this.inputNode.selectionStart;
        var end = this.inputNode.selectionEnd;
        this.finalText =
            this.finalText.slice(0, start) +
            this.finalText.slice(end);

        var part1 = this.finalText.slice(0, this.cursorPosition);
        var part2 = this.finalText.slice(this.cursorPosition);

        var needPoint = (this.isUpper && !this.sentence.trim().match(/[.,;!?](?=\s|$)/g));
        var point = needPoint ? '.' : '';

        var text = part1 + ' ' + this.sentence + point + ' ' + part2;
        text = text
            .replace(/\ +/g, ' ')
            .replace(/\n /g, '\n');

        return text.trim();
    }

    getSentence(phrase) {
        phrase = this.addPunctuation(phrase);
        var text = (this.sentence + ' ' + phrase).toLowerCase().trim();

        if (this.isUpper) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        return (' ' + text).replace(/\s+([.,!?:;])/g, "$1");
    }

    addPunctuation(text) {
        var replacements = {
            // en
            "period": ".",
            "comma": ",",
            "colon": ":",
            "semicolon": ";",
            "percent": "%",
            "question mark": "?",
            "exclamation mark": "!",
            "hyphen": "-",

            // es
            "punto y coma": ";",
            "punto": ".",
            "coma": ",",
            "dos puntos": ":",
            "por ciento": "%",
            "signo de interrogación": "?",
            "signo de exclamación": "!",
            "guión": "-",

            // de
            "punkt": ".",
            "komma": ",",
            "doppelpunkt": ":",
            "strichpunkt": ";",
            "prozent": "%",
            "fragesymbol": "?",
            "ausrufezeichen": "!",
            "bindestrich": "-",

            // fr
            "point d'exclamation": "!",
            "point d'interrogation": "?",
            "point virgule": ";",
            "point": ".",
            "virgule": ",",
            "deux points": ":",
            "pour cent": "%",
            "trait d'union": "-",

            // it
            "punto interrogativo": "?",
            "punto esclamativo": "!",
            "punto": ".",
            "virgola": ",",
            "due punti": ":",
            "punto e virgola": ";",
            "per cento": "%",
            "trattino": "-",

            // ru
            "точка с запятой": ";",
            "точка": ".",
            "запятая": ",",
            "двоеточие": ":",
            "процент": "%",
            "вопросительный знак": "?",
            "восклицательный знак": "!",
            "дефис": "-"
        };

        var pattern = new RegExp(Object.keys(replacements).join("|"), "gi");
        text = text.replace(pattern, match => replacements[match.toLowerCase()]);
        return text;
    }

    get isUpper() {
        var part = this.finalText.slice(0, this.cursorPosition).trim();
        var lastChar = part[part.length - 1];
        return !lastChar || lastChar.match(/[.,!?]/g);
    }
}