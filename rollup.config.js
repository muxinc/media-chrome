import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json'

export default {
  input: 'index.js',
  output: {
    file: pkg.main,
    format: 'es'
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
  ]
};

/** Gulp Example if needed later
exports.buildPlayerChrome = async function() {
  const bundle = await rollup({
    input: 'js/player-chrome.js',
    plugins: [
      minify({
        comments: false
      }),
      resolve(),
      commonjs(),
    ]
  });

  return bundle.write({
    file: pkg.main,
    format: 'es'
  });
};
**/
