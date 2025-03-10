import { AbstractInput } from '../../lib/jenyx/components/Input/AbstractInput.js';
import { IconButton } from '../Button/IconButton.js';
import { MIC_SVG } from '../Assets/MIC_SVG.js';
import { COPY_SVG } from '../Assets/COPY_SVG.js';

export class MenuButton extends AbstractInput {
    constructor(options) {
        super({
            mainButton: {
                class: IconButton,
                parentNode: document.body,
                text: MIC_SVG,
                style: [
                    'font-size: 1.5rem',
                    'position: absolute',
                    'margin-top: 0.25rem',
                ],
            },

            options
        });
        MenuButton.init.call(this);
    }

    static async init() {
        this.host.bind('inputNode', this, 'update', {run: true});
    };

    update() {
        this.mainButton.visible = this.host.inputNode;

        if (this.host.inputNode) {
            var inputRect = this.host.inputNode.getBoundingClientRect();
            var buttonRect = this.mainButton.node.getBoundingClientRect();
            this.mainButton.style = [
                `top: ${inputRect.bottom}px`,
                `left: ${inputRect.right - buttonRect.width}px`,
            ];
        };
    }
}