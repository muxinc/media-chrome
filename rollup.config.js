import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import multi from '@rollup/plugin-multi-entry';

import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/js/**/*.js',
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
  },
  plugins: [
    commonjs(),
    resolve(),
    multi({ entryFileName: '[name].js' }),
    terser(),
  ]
};
