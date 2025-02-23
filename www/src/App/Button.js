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
                'border: 1px solid var(--jn-border)',
                'background: var(--jn-primary)',
                'color: var(--jn-text)',
                'fill: var(--jn-text)',
                'box-sizing: border-box',
                'border-radius: 3rem',
                'padding: .5rem',
                'width: 3rem',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(1.05)',
                ],
            },
            options
        });
    }
}