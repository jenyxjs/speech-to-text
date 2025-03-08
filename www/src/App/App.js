import { AbstractApp } from '../AbstractApp/AbstractApp.js'
import { InitCssTheme } from './InitCssTheme.js';
import { LinkButton } from '../LinkButton/LinkButton.js';
import { SpeakArea } from '../SpeakArea/SpeakArea.js';

export class App extends AbstractApp {
	constructor() {
		super({
			initCssTheme: {
				class: InitCssTheme,
			},
			speakArea: {
				class: SpeakArea,
				parentNode: document.body,
				style: [
					'padding: 1rem',
					'max-width: 32rem',
				]
			},
			linkButton: {
				class: LinkButton,
				parentNode: document.body,
				style: ['padding: 1rem'],
				text: 'Jenyx',
				href: 'https://github.com/jenyxjs/speech-to-text',
			},
		});
	}
}

new App();