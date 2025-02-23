import { Control } from '../Control/Control.js';
import { Component } from '../Component/Component.js';

export class ActiveControl extends Control {
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
                event.stopPropagation()
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