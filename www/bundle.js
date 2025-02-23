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
    constructor(options) {
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

    get fullname() {
        var fullname = [];

        var constructor = this.constructor;

        while (constructor.name) {
            fullname.unshift(constructor.name);
            constructor = constructor.__proto__;
        }

        return fullname.join('_');
    }

    get listeners() {
        return this._.listeners;
    }

    set listeners(listeners) {
        for (var type in listeners) {
            var handler = listeners[type];
            this.on(type, handler);
        }
    }

    removeListeners(type) {
        for (var i in this._.listeners) {
            var listener = this._.listeners[i];
            (listener.type == type) && listener.remove();
        }
    }

    emit(type, value) {
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

    on(type, handler, options) {
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

    wait(type, options) {
        if (this[type]) return this[type];

        return new Promise(resolve => {
            var listener = this.on(type, event => {
                listener.remove();
                resolve(this[type]);
            }, options);
        });
    }

    bind(type, object, key, options) {
        key ||= type;

        if (typeof object[key] == 'function') {
            this._bindFunction(type, object, key, options);
        } else {
            this._bindProperty(type, object, key, options);
        }
    }

    _bindFunction(type, object, key, options) {
        this.on(type, event => {
            object[key].call(object, event, this[type]);
        }, options);
    }

    _bindProperty(type, object, key, options) {
        var runOptions = { ...options, run: true };

        this.on(type, event => {
            object[key] = this[type];
        }, runOptions);

        object?._?.jenyxClass && object.on(key, event => {
            this[type] = object[key];
        }, runOptions);
    }

    defineProperty(name, options) {
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

    set options(options) {
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

    get children() {
        return this._.children;
    }

    set children(children) {
        for (var name in children) {
            var value = children[name];

            if (value?.class) {
                var child = this.getNewClass(name, value);
                this.appendChild(name, child);
            }
        }

        this.emit('children');
    }

    getNewClass(name, value = {}) {
        var { class: Class, ...newOptions } = Object.assign({
            name: name,
            host: this,
        }, value);

        return new Class(newOptions);
    }

    appendChild(name, child) {
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

    removeChildren() {
        this._.children = {};
        this.emit('child');
    }

    replaceChildren(children) {
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

class RegisterServiceWorker extends Component {
    constructor (options) {
        super({
            serviceWorkerFileName: '',
            serviceWorker: null,
            options
        });

        RegisterServiceWorker.init.call(this);
    }

    static async init () {
        this.register();
    };

    async register () {
        await this.wait('serviceWorkerFileName');
        var url = this.serviceWorkerFileName;
        var registration = await navigator.serviceWorker.register(url, { scope: './' });

        var serviceWorker = registration.installing
            || registration.waiting
            || registration.active;

        this.serviceWorker = serviceWorker;
    };
}

class Pwa extends Component {
    constructor (options) {
        super({
            deferedPrompt: null,
            serviceWorkerFileName: '',
            registerServiceWorker: {
                class: RegisterServiceWorker
            },
            options
        });

        Pwa.init.call(this);
    }

    static async init () {
        window.addEventListener('beforeinstallprompt', event => {
            this.deferedPrompt = event;
            event.preventDefault();
        });

        this.bind('serviceWorkerFileName', this.registerServiceWorker);
    };

    install () {
        this.deferedPrompt.prompt();

        this.deferedPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                this.deferedPrompt = null;
            }
        });
    }
}

function createElement(tagName, parentNode, attrs, css) {
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
                'font-family: monospace',
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

class Control extends Component {
	constructor(options) {
		super();

		this.defineProperty('node', { enumerable: false });
		var tagName = options?.tagName || 'div';
		this.node = document.createElement(tagName);
		this._.visible = true;
		this.options = options;

		Control.init.call(this);
	}

	static stylesheet = createElement('style', document.head).sheet;

	static async init() {
		this.node.className = this.className;

		this.on('name', event => {
			this.node.setAttribute('data-name', this.name);
		});
	}

	get visible() {
		return this._.visible;
	}

	set visible(visible) {
		if (this.visible != visible) {
			this._.visible = visible;
			this.refreshVisible();
			this.emit('visible');
		}
	}

	refreshVisible() {
		if (this.visible) {
			var display = this._.styleIndex?.display || '';
		} else {
			var display = 'none';
		}

		this.node.style.display = display;
	}

	get style() {
		return this._.style || [];
	}

	set style(style) {
		if (typeof style == 'string') style = style.split(';');
		this._.styleIndex = concatStyle(this.style, style);
		this._.style = indexToStyle(this._.styleIndex);
		this.node.style.cssText = this._.style.join(';');
		this.refreshVisible();
	}

	get className() {
		var cssName = [];
		var constructor = this.constructor;

		while (constructor.name) {
			cssName.push(constructor.name);
			constructor = constructor.__proto__;
		}
		cssName.pop();

		return 'jn-' + cssName.join('-');
	}

	get parentNode() {
		return this.node.parentNode;
	}

	set parentNode(parentNode) {
		this.node && parentNode.appendChild(this.node);
	}

	set options(options) {
		if (options?.node) {
			for (var attr in options.node) {
				this.node[attr] = options.node[attr];
			}
			delete options.node;
		}

		super.options = options;
	}

	appendChild(name, child) {
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

	removeChildren() {
		this.node.innerHTML = '';
		super.removeChildren();
	}
}

function concatStyle(styles1, styles2) {
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

function indexToStyle(index) {
	var style = [];

	for (var i in index) {
		style.push(`${i}: ${index[i]}`);
	}

	return style;
}

class SpeechRecognition extends Component {
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
            !this.text && this.restart();
        }, { run: true });
    };

    restart() {
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
}

class AbstractInput extends Control {
    constructor (options) {
        super({
            tagName: options?.tagName || 'input',
            text: '',
            placeholder: '',
            keyupChange: false,
            style: [
                'width: 100%',
                'font-size: 16px',
                'box-sizing: border-box',
                'font-family: inherit',
                'background: inherit',
                'color: inherit',
                'outline: none',
                'border: 0',
            ],
            options
        });

        AbstractInput.init.call(this);
    }

    static async init () {
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

    focus () {
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
        ['focus', 'input', 'cut', 'paste'].forEach(value => {
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
                'flex-direction: column',
                'align-items: center',
                'justify-content: center',
                'box-sizing: border-box',
                'text-decoration: none',
                'cursor: pointer',
                'border-radius: 10rem',
                'background: var(--jn-primary)',
                'color: var(--jn-text)',
                'fill: var(--jn-text)',

                'padding: .5rem 1.5rem',
                'border: 1px solid var(--jn-border)',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(1.05)',
                ],
                selected: [
                    'filter: brightness(1.05)',
                ],
                selected_hovered: [
                    'filter: brightness(1.05)',
                ],
            },
            options
        });
    }
}

class SpeakArea extends Control {
    constructor(options) {
        super({
            empty: true,
            speechRecognition: {
                class: SpeechRecognition,
            },
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
                            text: 'Mic',
                        },
                        stopButton: {
                            class: Button,
                            text: 'Stop',
                        },
                        copyButton: {
                            class: Button,
                            text: 'Copy',
                        },
                    },
                    style: [
                        'flex-direction: column',
                        'display: flex',
                        'gap: 1rem',
                    ],
                }
            },
            style: [
                'display: flex',
                'gap: 1rem',
                'font-family: monospace',
            ],
            options
        });

        SpeakArea.init.call(this);
    }

    static init() {
        this.speechRecognition.bind('text', this.textArea);
        this.speechRecognition.bind('isRun', this, 'refresh');
        this.textArea.bind('text', this, 'refresh', { run: true });

        this.panel.micButton.on('click', event => {
            this.speechRecognition.isRun = !this.speechRecognition.isRun;
        });

        this.panel.copyButton.on('click', event => {
            navigator.clipboard.writeText(this.textArea.node.value);
            this.speechRecognition.restart();
        });
    }

    refresh() {
        var text = this.textArea.node.value;

        this.panel.micButton.visible = !this.speechRecognition.isRun;
        this.panel.stopButton.visible = this.speechRecognition.isRun && !text;
        this.panel.copyButton.visible = text;
    }
}

class LinkButton extends ActiveControl {
    constructor (options) {
        super({
            style: [
                'cursor: pointer',
                'color: var(--jn-link)',
                'filter: none',
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
			speakArea: {
				class: SpeakArea,
				parentNode: document.body,
				style: [
					'padding: 1rem',
				]
			},
			linkButton: {
				class: LinkButton,
				parentNode: document.body,
				text: 'Jenyx',
				href: 'https://github.com/jenyxjs/speech-to-text',
				style: [
					'padding: 1rem',
				]
			},
			initCssTheme: {
				class: InitCssTheme,
			},
			pwa: {
				class: Pwa,
				serviceWorkerFileName: './serviceWorker.js',
			},
		});
	}
}

new App();

export { App };
//# sourceMappingURL=bundle.js.map
