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
                ],
            },

            options
        });
        MenuButton.init.call(this);
    }

    static async init() {

    };
}