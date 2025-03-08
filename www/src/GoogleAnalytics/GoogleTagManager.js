import { Component } from '../../lib/jenyx/components/Component/Component.js'

export class GoogleTagManager extends Component {
    constructor(options) {
        super({
            id: '',
            options
        });

        GoogleTagManager.init.call(this);
    }

    static init() {
        (function (w, d, s, l, id) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });

            var j = d.createElement(s);
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + id +
                (l != 'dataLayer' ? `&l=${l}` : '');

            var f = d.getElementsByTagName(s)[0];
            f.parentNode.insertBefore(j, f);

        })(window, document, 'script', 'dataLayer', this.id);
    }
}
