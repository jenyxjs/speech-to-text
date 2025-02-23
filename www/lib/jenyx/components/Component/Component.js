/**
 * Jenyx UI Library
 * 
 * Author: Alexey Khakhalin (https://github.com/jenyxjs)
 * Contact: alexey.hahalin@gmail.com
 * License: MIT
 */

import { Event } from './Event.js';
import { Listener } from './Listener.js';

export class Component {
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
            }, options)
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