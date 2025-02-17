import { Component } from '../../components/Component/Component.js';
import { RegisterServiceWorker } from './RegisterServiceWorker.js';

export class Pwa extends Component {
    constructor (options) {
        super({
            deferedPrompt: null,
            serviceWorkerFileName: '',
            registerServiceWorker: {
                class: RegisterServiceWorker
            },
            options
        });

        Pwa.init.call(this);
    }

    static async init () {
        window.addEventListener('beforeinstallprompt', event => {
            this.deferedPrompt = event;
            event.preventDefault();
        });

        this.bind('serviceWorkerFileName', this.registerServiceWorker);
    };

    install () {
        this.deferedPrompt.prompt();

        this.deferedPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                this.deferedPrompt = null;
            }
        });
    }
};