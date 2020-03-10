import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: 'js/player-chrome.js',
  output: {
    dir: 'dist/components',
    format: 'es'
  },
  plugins: [
    minify({
      comments: false
    }),
    resolve(),
    commonjs(),
  ]
};
