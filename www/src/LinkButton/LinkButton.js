import { ActiveControl } from '../../lib/jenyx/components/ActiveControl/ActiveControl.js';

export class LinkButton extends ActiveControl {
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