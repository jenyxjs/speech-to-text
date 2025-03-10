import { Label } from '../../lib/jenyx/components/Label/Label.js';

export class TitleLabel extends Label {
    constructor(options) {
        super({
            style: [
                'margin-top: 2rem',
                'font-size: 0.9rem',
            ],
            options
        });
    }
}