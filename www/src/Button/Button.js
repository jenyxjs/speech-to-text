import { ActiveControl } from '../../lib/jenyx/components/ActiveControl/ActiveControl.js';

export class Button extends ActiveControl {
    constructor(options) {
        super({
            style: [
                'display: flex',
                'align-items: center',
                'justify-content: center',
                'text-decoration: none',
                'cursor: pointer',
                'box-sizing: border-box',
                'border-radius: 3rem',
                'width: 3rem',
                'padding: .7rem',
                'border: 1px solid var(--jn-border)',
                'background: var(--jn-primary)',
                'color: var(--jn-text)',
                'fill: var(--jn-text)',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(1.05)',
                ],
                selected: [
                    'filter: drop-shadow(0px 0px 2px black)',
                ],
            },
            options
        });
    }
}