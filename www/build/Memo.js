class Event {
    constructor(options) {
        this.type = options.type;
        this.target = options.target;
        this.value = options.value;
        this.targetType = options.targetType;
        this.send();
    }

    send() {
        var context = this.target;

        do {
            for (var i in context._.listeners) {
                var listener = context._.listeners[i];

                var isHandler = listener.handler;
                var isType = (listener.type == this.targetType);
                var isTarget = (listener.context == this.target);
                var isBubbling = listener.bubbling;
                if (!isHandler || !isType || !(isTarget || isBubbling)) continue;

                if (listener.final) {
                    clearTimeout(listener.finalTimeoutId);
                    listener.finalTimeoutId = setTimeout(() => {
                        listener.handler.call(listener.context, this, listener);
                    });
                } else {
                    listener.handler.call(listener.context, this, listener);
                }
            }

            context = context.parent;
        } while (context);
    }
}

class Listener {
    constructor(options) {
        this.id = ++Listener.id;
        options.context._.listeners[this.id] = this;
        this.type = options.type;
        this.context = options.context;
        this.handler = options.handler;
        this.bubbling = options.bubbling;
        this.final = options.final;
        this.finalTimeoutId = 0;
        options.run && this.run();
        options.exist && this.exist();
    }

    static id = 0;

    remove() {
        delete this.context._.listeners[this.id];
    }

    run() {
        this.handler.call(this.context);
    }

    exist() {
        if (this.context[this.type]) {
            this.handler.call(this.context);
        }
    }
}

/**
 * Jenyx UI Library
 * 
 * Author: Alexey Khakhalin (https://github.com/jenyxjs)
 * Contact: alexey.hahalin@gmail.com
 * License: MIT
 */


class Component {
    constructor (options) {
        Object.defineProperty(this, '_', { enumerable: false, value: {} });
        this.defineProperty('name', { enumerable: false });
        this.defineProperty('host', { enumerable: false });
        this.defineProperty('parent', { enumerable: false });
        this._.jenyxClass = true;
        this._.children = {};
        this._.listeners = {};
        this.options = options;
    }

    static version = '0.x';

    get fullname () {
        var fullname = [];

        var constructor = this.constructor;

        while (constructor.name) {
            fullname.unshift(constructor.name);
            constructor = constructor.__proto__;
        }

        return fullname.join('_');
    }

    get listeners () {
        return this._.listeners;
    }

    set listeners (listeners) {
        for (var type in listeners) {
            var handler = listeners[type];
            this.on(type, handler);
        }
    }

    removeListeners (type) {
        for (var i in this._.listeners) {
            var listener = this._.listeners[i];
            (listener.type == type) && listener.remove();
        }
    }

    emit (type, value) {
        var event = new Event({
            targetType: type,
            type: type,
            value: value,
            target: this,
        });

        this['on' + type] && this['on' + type](event);

        new Event({
            targetType: '*',
            type: type,
            value: value,
            target: this,
        });
    }

    on (type, handler, options) {
        return new Listener({
            context: this,
            type: type,
            handler: handler,
            bubbling: options?.bubbling,
            run: options?.run,
            exist: options?.exist,
            final: options?.final,
        });
    }

    wait (type, options) {
        if (this[type]) return this[type];

        return new Promise(resolve => {
            var listener = this.on(type, event => {
                listener.remove();
                resolve(this[type]);
            }, options);
        });
    }

    bind (type, object, key, options) {
        key ||= type;

        if (typeof object[key] == 'function') {
            this._bindFunction(type, object, key, options);
        } else {
            this._bindProperty(type, object, key, options);
        }
    }

    _bindFunction (type, object, key, options) {
        this.on(type, event => {
            object[key].call(object, event, this[type]);
        }, options);
    }

    _bindProperty (type, object, key, options) {
        var runOptions = { ...options, run: true };

        this.on(type, event => {
            object[key] = this[type];
        }, runOptions);

        object?._?.jenyxClass && object.on(key, event => {
            this[type] = object[key];
        }, runOptions);
    }

    defineProperty (name, options) {
        var enumerable = (options?.enumerable === false) ? false : true;

        Object.defineProperty(this, name, {
            get: function () {
                return this._[name];
            },
            set: function (value) {
                if (this._[name] !== value) {
                    this._[name] = value;
                    this.emit(name, value);
                }
            },
            enumerable: enumerable,
        });
    }

    set options (options) {
        for (var name in options) {
            var value = options[name];
            var newClass = value?.class;
            var newProperty = !(name in this);

            if (newClass) {
                !Object.hasOwn(this, name) && this.defineProperty(name);
                this[name] = this.getNewClass(name, value);
            } else if (newProperty) {
                this.defineProperty(name);
                this[name] = value;
            } else if (
                this[name]?._?.jenyxClass &&
                name != 'host' &&
                this[name].options !== value
            ) {
                this[name].options = value;
            } else {
                this[name] = value;
            }
        }

        this.emit('options', options);
    }

    get children () {
        return this._.children;
    }

    set children (children) {
        for (var name in children) {
            var value = children[name];

            if (value?.class) {
                var child = this.getNewClass(name, value);
                this.appendChild(name, child);
            }
        }

        this.emit('children');
    }

    getNewClass (name, value = {}) { 
        var { class: Class, ...newOptions } = Object.assign({
            name: name,
            host: this,
        }, value);

        return new Class(newOptions);
    }

    appendChild (name, child) {
        child.parent = this;
        this._.children[name] = child;

        !this.hasOwnProperty(name) && Object.defineProperty(this, name, {
            get: function () {
                return this.children[name];
            },
            set: function (child) {
                this.children[name] = child;
            }
        });

        this.emit('child', child);
    }

    removeChildren () {
        this._.children = {};
        this.emit('child');
    }

    replaceChildren (children) {
        this.removeChildren();
        this.children = children;
    }
}

class AbstractApp extends Component {
    constructor (options) {
        super({ app: null });

        (options.root || window).app = this;
        this.options = options;

        this.app = this;
    }
}

function createElement (tagName, parentNode, attrs, css) {
	var node = document.createElement(tagName);

	parentNode?.appendChild(node);
	return node;
}

class CssRule extends Component {
    constructor (options) {
        super({
            selector: '',
            style: [],
            index: null,
            options
        });

        CssRule.init.call(this);
    }

    static async init () {
        this.bind('selector', this, 'refresh');
        this.bind('style', this, 'refresh', { run: true });
    }

    static stylesheet = null;

    refresh () {
        CssRule.stylesheet ||= createElement('style', document.head).sheet;

        if (this.index !== null) {
            CssRule.stylesheet.deleteRule(this.index);
        }

        if (this.selector) {
            this.index = this.createStylesheetRule();
        }
    }

    createStylesheetRule () {
        try {
            var stylesheet = CssRule.stylesheet;
            var styles = this.style.join(';');
            var rule = this.selector + '{' + styles + '}';
            var index = this.index || stylesheet.cssRules.length;
            return stylesheet.insertRule(rule, index);
        } catch (ex) {
            return null;
        }
    }
}

class InitCssTheme extends Component {
    constructor(options) {
        super(options);

        new CssRule({
            selector: 'html, body',
            style: [
                'height: 100%',
                'max-height: 100%',
                'margin: 0',
                'font-family: sans-serif',
                'font-size: 15px',
            ]
        });

        new CssRule({
            selector: ':root',
            style: [
                `--jn-primary: hsl(200 50% 95%)`,
                `--jn-bg: hsl(0 0% 100%)`,
                `--jn-text: hsl(0 0% 10%)`,
                `--jn-link: hsl(210 50% 50%)`,
                `--jn-grey: hsl(0 0% 50%)`,
                `--jn-border: hsl(200 50% 85%)`,
            ]
        });
    }
}

class GoogleAnalytics extends Component {
    constructor(options) {
        super({
            id: '',
            options
        });

        GoogleAnalytics.init.call(this);
    }

    static init() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.id}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', this.id);        
    }
}

class Control extends Component {
	constructor (options) {
		super();

		this.defineProperty('node', { enumerable: false });
		var tagName = options?.tagName || 'div';
		this.node = document.createElement(tagName);
		this._.visible = true;
		this.options = options;

		Control.init.call(this);
	}

	static stylesheet = createElement('style', document.head).sheet;

	static async init () {
		this.node.className = this.className;

		this.on('name', event => {
			this.node.setAttribute('data-name', this.name);
		});
	}

	get visible () {
		return this._.visible;
	}

	set visible (visible) {
		if (this.visible != visible) {
			this._.visible = visible;
			this.refreshVisible();
			this.emit('visible');
		}
	}

	refreshVisible () {
		if (this.visible) {
			var display = this._.styleIndex?.display || '';
		} else {
			var display = 'none';
		}

		this.node.style.display = display;
	}

	get style () {
		return this._.style || [];
	}

	set style (style) {
		if (typeof style == 'string') style = style.split(';');
		this._.styleIndex = concatStyle(this.style, style);
		this._.style = indexToStyle(this._.styleIndex);
		this.node.style.cssText = this._.style.join(';');
		this.refreshVisible();
	}

	get className () {
		var cssName = [];
		var constructor = this.constructor;

		while (constructor.name) {
			cssName.push(constructor.name);
			constructor = constructor.__proto__;
		}
		cssName.pop();

		return 'jn-' + cssName.join('-');
	}

	get parentNode () {
		return this.node.parentNode;
	}

	set parentNode (parentNode) {
		this.node && parentNode.appendChild(this.node);
	}

	set options (options) {
		if (options?.node) {
			for (var attr in options.node) {
				this.node[attr] = options.node[attr];
			}
			delete options.node;
		}

		super.options = options;
	}

	appendChild (name, child) {
		super.appendChild(name, child);

		if (child.parentNode) {
			child.parentNode.appendChild(child.node);
		} else {
			this.node
				&& child.node
				&& !child.node.parentNode
				&& this.node.appendChild(child.node);
		}
	}

	removeChildren () {
		this.node.innerHTML = '';
		super.removeChildren();
	}
}

function concatStyle (styles1, styles2) {
	var index = {};

	styles1.forEach(value => {
		var key = value.split(':')[0];
		var value = value.split(':')[1];
		index[key] = value.trim();
	});

	styles2.forEach(value => {
		if (value.trim()) {
			var key = value.split(':')[0].trim();
			var value = value.split(':')[1].trim();
			index[key] = value;
		}
	});

	return index;
}

function indexToStyle (index) {
	var style = [];

	for (var i in index) {
		style.push(`${i}: ${index[i]}`);
	}

	return style;
}

class AbstractInput extends Control {
    constructor(options) {
        super({
            tagName: options?.tagName || 'input',
            text: '',
            placeholder: '',
            keyupChange: false,
            style: [
                'font-family: inherit',
                'background: inherit',
                'color: inherit',
                'outline: none',
                'box-sizing: border-box',
                'width: 100%',
                'border: 0',
                'font-size: 1rem',
            ],
            options
        });

        AbstractInput.init.call(this);
    }

    static async init() {
        this.bind('text', this.node, 'value');
        this.bind('placeholder', this.node, 'placeholder');

        this.node.tabIndex = 0;

        this.node.addEventListener('change', event => {
            this.text = this.node.value;
        });

        this.node.addEventListener('input', event => {
            this.text = this.node.value;
            this.emit('input', this.node.value);
        });

        this.node.addEventListener('keyup', event => {
            if (this.keyupChange) {
                this.text = this.node.value;
            }

            if (event.keyCode == 13) {
                this.emit('enter');
                this.node.click();
            } else if (event.keyCode == 9 && this.node == document.activeElement) {
                this.node.style.outline = 'auto';
            }
        });

        this.node.addEventListener('blur', event => {
            this.node.style.outline = 'none';
            this.emit('blur');
        });

        this.node.addEventListener('focus', event => {
            this.emit('focus');
        });
    }

    focus() {
        setTimeout(this.node.focus.bind(this.node));
    };
}

class Textarea extends AbstractInput {
    constructor(options) {
        super({
            tagName: 'textarea',
            style: [
                'resize: none',
                'overflow-y: hidden',
            ],
            options
        });

        Textarea.init.call(this);
    }

    static async init() {
        ['focus', 'input', 'cut', 'paste', 'selectionchange'].forEach(value => {
            this.node.addEventListener(value, this.auroresize.bind(this));
        });

        this.on('text', this.auroresize.bind(this));
    }

    auroresize() {
        this.node.style.height = 'auto';
        this.node.style.height = this.node.scrollHeight + 'px';
    }
}

class ActiveControl extends Control {
    constructor(options) {
        super({
            tagName: options?.tagName || 'a',

            text: null,
            href: null,
            target: '_self', // '_self' || '_blank' 

            style: [
                'user-select: none',
                'border: 0',
                'outline: 0',
            ],
            styleSet: {
                class: Component,

                selected_disabled: null,
                selected_pressed: null,
                selected_focused: null,
                selected_hovered: null,

                selected: null,
                disabled: null,
                pressed: null,
                focused: null,
                hovered: null,
            },

            selected: null,
            disabled: null,
            pressed: null,
            focused: null,
            hovered: null,

            currentStyle: [],
            options
        });

        ActiveControl.init.call(this);
    }

    static init() {
        this.node.onclick = event => {
            if (!this.disabled && event.which == 1) {
                this.emit('click', event);
                event.stopPropagation();
            }
        };

        this.node.onmouseover = event => {
            this.hovered = true;
        };

        this.node.onmouseout = event => {
            if (this.visible) {
                this.hovered = false;
            }
        };

        this.node.onmousedown = event => {
            if (this.visible) {
                this.pressed = true;
            }
        };

        this.node.onmouseup = event => {
            if (this.visible) {
                this.pressed = false;
            }
        };

        this.node.onblur = event => {
            if (this.visible) {
                this.focused = false;
            }
        };

        this.node.onfocus = event => {
            if (this.visible) {
                this.focused = true;
            }
        };

        this.on('text', event => {
            if (this.text !== undefined && this.text !== null) {
                this.node.innerHTML = this.text;
            }
        }, { run: true });

        this.on('href', event => {
            if (this.href !== undefined && this.href !== null) {
                this.node.href = this.href;
            }
        }, { run: true });

        this.on('target', event => {
            this.node.target = this.target;
        }, { run: true });

        this.on('focused', event => {
            if (this.focused) {
                this.node.focus();
            } else {
                this.node.blur();
            }
        }, { run: true });

        this.on('hovered', event => {
            if (this.focused && !this.hovered) {
                this.focused = false;
            }
        });

        [
            'selected_disabled',
            'selected_pressed',
            'selected_focused',
            'selected_hovered',

            'selected',
            'disabled',
            'pressed',
            'focused',
            'hovered',
        ].forEach(prop => {
            this.styleSet.bind(prop, this, 'refreshStyle');
        });

        [
            'visible',
            'disabled',
            'selected',
            'pressed',
            'focused',
            'hovered',
        ].forEach(prop => {
            this.bind(prop, this, 'refreshStyle');
        });

        this.refreshStyle();
    }

    refreshStyle() {
        this.node.tabIndex = this.disabled ? -1 : 0;
        this.currentStyle = this.getStyle();
    }

    getStyle() {
        var set = this.styleSet;

        if (this.selected && this.disabled) {
            return set.selected_disabled;
        } else if (this.selected && this.pressed && set.selected_pressed) {
            return set.selected_pressed;
        } else if (this.selected && this.focused && set.selected_focused) {
            return set.selected_focused;
        } else if (this.selected && this.hovered && set.selected_hovered) {
            return set.selected_hovered;
        } else if (this.disabled) {
            return set.disabled;
        } else if (this.selected) {
            return set.selected;
        } else if (this.pressed) {
            return set.pressed;
        } else if (this.focused) {
            return set.focused;
        } else if (this.hovered) {
            return set.hovered;
        }

        return [];
    }

    set currentStyle(value) {
        var styles = [...this.style, ...value || []];
        this.node.style.cssText = styles.join(';');
        this.refreshVisible();
    }
}

class Button extends ActiveControl {
    constructor(options) {
        super({
            style: [
                'display: flex',
                'align-items: center',
                'justify-content: center',
                'text-decoration: none',
                'cursor: pointer',
                'box-sizing: border-box',
                'border-radius: 3rem',
                'width: 3rem',
                'padding: .7rem',
                'border: 1px solid var(--jn-border)',
                'background: var(--jn-primary)',
                'color: var(--jn-text)',
                'fill: var(--jn-text)',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(1.05)',
                ],
                selected: [
                    'filter: drop-shadow(0px 0px 1px red)',
                ],
            },
            options
        });
    }
}

var MIC_SVG = `<svg style="width: 100%; height: 100%; transform: scale(1.0); stroke-width: 0px; stroke: var(--jn-text);" viewBox="0 -960 960 960">
<path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" /></svg>`;

var COPY_SVG = `<svg style="width: 100%; height: 100%; transform: scale(1.0); stroke-width: 0px; stroke: var(--jn-text);" viewBox="0 -960 960 960">
<path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>`;

class SpeechRecognition extends AbstractInput {
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
            this.updatePosition();
        });

        this.inputNode.addEventListener('click', () => {
            this.cursorPosition = this.inputNode.selectionStart;
        });

        this.inputNode.addEventListener('keyup', () => {
            this.cursorPosition = this.inputNode.selectionStart;
        });
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
        var part2 =  this.finalText.slice(this.cursorPosition);

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

class SpeakArea extends Control {
    constructor(options) {
        super({
            children: {
                textArea: {
                    class: Textarea,
                    placeholder: 'Speak into the microphone',
                    style: [
                        'display: flex',
                        'border-radius: 1em',
                        'padding: 1rem',
                        'background: var(--jn-primary)',
                        'border: 1px solid var(--jn-border)',
                    ]
                },
                panel: {
                    class: Control,
                    children: {
                        micButton: {
                            class: Button,
                            text: MIC_SVG,
                        },
                        copyButton: {
                            class: Button,
                            text: COPY_SVG,
                        },
                    },
                },
            },
            style: [
                'display: flex',
                'gap: 1rem',
                'font-family: monospace',
            ],
            options
        });

        this.options = {
            speechRecognition: {
                class: SpeechRecognition,
                inputNode: this.textArea.node,
            }
        };

        SpeakArea.init.call(this);
    }

    static init() {
        var { speechRecognition, textArea } = this;
        var { micButton, copyButton } = this.panel;

        speechRecognition.bind('isActive', this, 'refresh');
        speechRecognition.bind('finalText', this, 'refresh', { run: true });

        micButton.on('click', event => {
            speechRecognition.isActive = !speechRecognition.isActive;
            this.refresh();
        });

        copyButton.on('click', event => {
            navigator.clipboard.writeText(textArea.node.value);
            speechRecognition.reset();
            this.refresh();
        });
    }

    refresh() {
        var { micButton, copyButton } = this.panel;
        
        micButton.selected = this.speechRecognition.isActive;
        copyButton.selected = this.speechRecognition.isActive;
        
        copyButton.visible = this.textArea.node.value;
        micButton.visible = !copyButton.visible;
    }
}

class LinkButton extends ActiveControl {
    constructor (options) {
        super({
            style: [
                'color: var(--jn-link)',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(0.8)',
                ],
            },
            options
        });
    }
}

class App extends AbstractApp {
	constructor() {
		super({
			initCssTheme: {
				class: InitCssTheme,
			},
			speakArea: {
				class: SpeakArea,
				parentNode: document.body,
				style: [
					'max-width: 32rem',
					'padding: 1rem',
				]
			},
			linkButton: {
				class: LinkButton,
				parentNode: document.body,
				text: 'Download Chrome extension',
				href: 'https://github.com/jenyxjs/speech-to-text',
				style: [
					'padding: 1.25rem'
				],
			},
			googleAnalytics: {
				class: GoogleAnalytics,
				id: 'G-ELXBKNLREG',
			},
		});
	}
}

new App();

export { App };
//# sourceMappingURL=Memo.js.map
