/**
 * npm install rollup --global
 * rollup -wc /srv/speech-to-text/docs/memo.rollup.config.mjs
 */

export default {
	input: '/srv/speech-to-text/www/src/Memo/Memo.js',
	output: [
		{
			file: '/srv/speech-to-text/www/build/Memo.js',
			sourcemap: true
		},
	],
};