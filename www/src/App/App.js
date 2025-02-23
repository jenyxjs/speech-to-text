import { AbstractApp } from '../AbstractApp/AbstractApp.js'
import { Pwa } from '../Pwa/Pwa.js';
import { InitCssTheme } from './InitCssTheme.js';
import { SpeakArea } from '../SpeakArea/SpeakArea.js';
import { LinkButton } from '../LinkButton/LinkButton.js';

export class App extends AbstractApp {
	constructor() {
		super({
			speakArea: {
				class: SpeakArea,
				parentNode: document.body,
				style: [
					'padding: 1rem',
				]
			},
			linkButton: {
				class: LinkButton,
				parentNode: document.body,
				text: 'Jenyx',
				href: 'https://github.com/jenyxjs/speech-to-text',
				style: [
					'margin: 1rem',
				]
			},
			initCssTheme: {
				class: InitCssTheme,
			},
			pwa: {
				class: Pwa,
				serviceWorkerFileName: './serviceWorker.js',
			},
		});
	}
}

new App();