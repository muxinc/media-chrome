import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
// rollup
import * as rollupPkg from 'rollup';
import rollupPluginTerser from 'rollup-plugin-terser';

const { series, watch } = gulp;
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const { rollup } = rollupPkg;
const { terser } = rollupPluginTerser;

export async function build() {
  await del('dist');

  const bundle = await rollup({
    input: 'index.js',
    plugins: [
      commonjs(),
      resolve(),
      terser(),
    ]
  });

  return bundle.write({
    file: pkg.main,
    format: 'es'
  });
}

export function dev() {
  // livereload.listen();
  watch('src/**/**', series('build'));
}

export default series(build);
