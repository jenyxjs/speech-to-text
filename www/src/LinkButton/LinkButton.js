import { ActiveControl } from '../../components/ActiveControl/ActiveControl.js';

export class LinkButton extends ActiveControl {
    constructor (options) {
        super({
            style: [
                'text-decoration: none',
                'cursor: pointer',
                'color: var(--ax-link-bg)',
                'filter: none',
            ],
            styleSet: {
                hovered: [
                    'filter: brightness(0.8)',
                    'text-decoration: underline',
                ],
                disabled: [
                    'cursor: default',
                    'color: var(--ax-grey-bg)',
                ],
                selected_disabled: [
                    'cursor: default',
                    'color: var(--ax-grey-bg)',
                ],
                selected: [
                    'filter: brightness(0.8)',
                ],
                selected_hovered: [
                    'color: var(--ax-bg)',
                    'filter: brightness(0.8)',
                ],
            },
            options: options
        });
    }
}