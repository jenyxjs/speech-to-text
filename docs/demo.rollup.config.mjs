/**
 * npm install rollup --global
 * rollup -wc /srv/speech-to-text/docs/demo.rollup.config.mjs
 */

export default {
	input: '/srv/speech-to-text/www/src/Demo/Demo.js',
	output: [
		{
			file: '/srv/speech-to-text/www/build/Demo.js',
			sourcemap: true
		},
	],
};