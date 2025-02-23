import { AbstractApp } from '../AbstractApp/AbstractApp.js'
import { Pwa } from '../Pwa/Pwa.js';
import { SpeechRecognition } from '../SpeechRecognition/SpeechRecognition.js';
import { InitCssTheme } from './InitCssTheme.js';
import { Layout } from './Layout.js';

export class App extends AbstractApp {
	constructor() {
		super({
			initCssTheme: {
				class: InitCssTheme,
			},
			pwa: {
				class: Pwa,
				serviceWorkerFileName: './serviceWorker.js',
			},
			speechRecognition: {
				class: SpeechRecognition,
			},
			layout: {
				class: Layout,
			}
		});
	}
}

new App();