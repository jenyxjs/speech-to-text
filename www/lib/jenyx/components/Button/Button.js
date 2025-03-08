import { ActiveControl } from '../ActiveControl/ActiveControl.js';

export class Button extends ActiveControl {
    constructor (options) {
        super({
            style: [
                'display: flex',
                'flex-direction: column',
                'align-items: center',
                'justify-content: center',
                'box-sizing: border-box',
                'text-decoration: none',
                'cursor: pointer',
                'padding: 0.5rem 3rem',
                'border-radius: 10rem',
                'background: var(--jn-bg)',
                'color: var(--jn-text)',
                'fill: var(--jn-text)',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(1.05)',
                ],
                disabled: [
                    'background: var(--jn-grey)',
                    'cursor: default',
                ],
                selected_disabled: [
                    'background: var(--jn-grey)',
                    'cursor: default',
                ],
                selected_focused: [
                    'filter: brightness(1.05)',
                ],
                selected_pressed: [
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