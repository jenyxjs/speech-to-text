import { Component } from '../../lib/jenyx/components/Component/Component.js';
import { createElement } from '../../lib/jenyx/components/Control/createElement.js';

export class CssRule extends Component {
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

