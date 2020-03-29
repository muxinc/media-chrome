const { src, dest, watch, series } = require('gulp');
const livereload = require('gulp-livereload');

const pkg = require('./package.json');
const del = require('del');

// rollup
const { rollup } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require("rollup-plugin-terser");

async function build() {
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

function dev() {
  // livereload.listen();
  watch('src/**/**', series('build'));
}

exports.build = build;
exports.dev = dev;
exports.default = series(build);
