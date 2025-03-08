import { ActiveControl } from '../../lib/jenyx/components/ActiveControl/ActiveControl.js';

export class LinkButton extends ActiveControl {
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