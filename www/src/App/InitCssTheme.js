import { Component } from '../../lib/jenyx/components/Component/Component.js'
import { CssRule } from '../../lib/jenyx/components/CssRule/CssRule.js';

export class InitCssTheme extends Component {
    constructor(options) {
        super(options);

        new CssRule({
            selector: 'html, body',
            style: [
                'height: 100%',
                'max-height: 100%',
                'margin: 0',
            ]
        });

        new CssRule({
            selector: ':root',
            style: [
                `--jn-primary: hsl(200 50% 95%)`,
                `--jn-bg: hsl(0 0% 100%)`,
                `--jn-text: hsl(0 0% 10%)`,
                `--jn-link: hsl(0 0% 15%)`,
                `--jn-grey: hsl(0 0% 50%)`,
                `--jn-border: hsl(200 50% 85%)`,
            ]
        });
    }
}
