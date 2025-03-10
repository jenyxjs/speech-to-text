import { Label } from '../../lib/jenyx/components/Label/Label.js';

export class TitleLabel extends Label {
    constructor(options) {
        super({
            style: [
                'margin: 2rem 0 0.5rem',
                'font-size: 1rem',
            ],
            options
        });
    }
}