/**
 * npm install rollup --global
 * rollup -wc /srv/speech-to-text/docs/rollup.config.mjs
 */

export default {
	input: '/srv/speech-to-text/www/src/App/App.js',
	output: [
		{
			file: '/srv/speech-to-text/www/bundle.js',
			sourcemap: true
		},
	],
};