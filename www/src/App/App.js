import { AbstractApp } from '../../lib/jenyx/components/AbstractApp/AbstractApp.js'
import { Pwa } from '../../lib/jenyx/components/Pwa/Pwa.js';
import { InitCssTheme } from './InitCssTheme.js';
import { Layout } from './Layout.js';
import { SpeechRecognition } from '../SpeechRecognition/SpeechRecognition.js';

export class App extends AbstractApp {
	constructor(root) {
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

new App(window);