import { Component } from '../../lib/jenyx/components/Component/Component.js'

export class GoogleAnalytics extends Component {
    constructor(options) {
        super({
            id: '',
            options
        });

        GoogleAnalytics.init.call(this);
    }

    static init() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.id}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', this.id);        
    }
}
