import { Component } from '../../lib/jenyx/components/Component/Component.js';

export class RegisterServiceWorker extends Component {
    constructor (options) {
        super({
            serviceWorkerFileName: '',
            serviceWorker: null,
            options
        });

        RegisterServiceWorker.init.call(this);
    }

    static async init () {
        this.register();
    };

    async register () {
        await this.wait('serviceWorkerFileName');
        var url = this.serviceWorkerFileName;
        var registration = await navigator.serviceWorker.register(url, { scope: './' });

        var serviceWorker = registration.installing
            || registration.waiting
            || registration.active;

        this.serviceWorker = serviceWorker;
    };
};