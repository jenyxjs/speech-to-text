import { AbstractApp } from './AbstractApp.js'
import { InitCssTheme } from '../Css/InitCssTheme.js';
import { LinkButton } from '../Button/LinkButton.js';
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
					'max-width: 32rem',
					'padding: 1rem',
				]
			},
			linkButton: {
				class: LinkButton,
				parentNode: document.body,
				text: 'Chrome extension',
				href: 'https://github.com/jenyxjs/speech-to-text',
				style: [
					'padding: 1.25rem'
				],
			},
		});
	}
}

new App();