import { Component } from '../../lib/jenyx/components/Component/Component.js';

export class AbstractApp extends Component {
    constructor (options) {
        super({ app: null });

        (options.root || window).app = this;
        this.options = options;

        this.app = this;
    }
}