import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';
import pkg from './package.json'

export default {
  input: 'js/player-chrome.js',
  output: {
    file: pkg.main,
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
