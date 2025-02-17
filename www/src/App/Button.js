import { ActiveControl } from '../../lib/jenyx/components/ActiveControl/ActiveControl.js';

export class Button extends ActiveControl {
    constructor(options) {
        super({
            style: [
                'display: flex',
                'flex-direction: column',
                'align-items: center',
                'justify-content: center',
                'box-sizing: border-box',
                'text-decoration: none',
                'cursor: pointer',
                'border-radius: 10rem',
                'background: var(--jn-primary)',
                'color: var(--jn-text)',
                'fill: var(--jn-text)',

                'padding: .5rem 1.5rem',
                'border: 1px solid var(--jn-border)',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(1.05)',
                ],
                selected: [
                    'filter: brightness(1.05)',
                ],
                selected_hovered: [
                    'filter: brightness(1.05)',
                ],
            },
            options
        });
    }
}