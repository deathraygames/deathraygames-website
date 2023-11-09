import copy from 'rollup-plugin-copy';
import games from './src/gitHubGamesList.js';

const copyTargets = games.map((gameName) => ({ src: `node_modules/${gameName}`, dest: 'play-online/' }));

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/drg.js',
		format: 'esm',
	},
	plugins: [
		copy({
			targets: copyTargets,
		}),
	],
};
