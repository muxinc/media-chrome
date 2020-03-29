const { src, dest } = require('gulp');
const { rollup } = require('rollup');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const minify = require('rollup-plugin-babel-minify');
const each = require('gulp-each');
const pkg = require('./package.json');
const through2 = require('through2');

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

exports.buildHLS = async function() {
  const bundle = await rollup({
    input: 'js/hls-video-element.js',
    plugins: [
      minify({
        comments: false
      }),
      resolve(),
      commonjs(),
    ]
  });

  return bundle.write({
    file: './dist/hls-video-element.js',
    format: 'es'
  });
};

// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import minify from 'rollup-plugin-babel-minify';
// import pkg from './package.json'

// Rollup's promise API works great in an `async` task
exports.default = function() {
  return src('js/*.js')
    // Instead of using gulp-uglify, you can create an inline plugin
    .pipe(through2.obj(function(file, _, cb) {
      rollup({
        input: './js/'+file.basename,
        plugins: [
          minify({
            comments: false
          }),
          resolve(),
          commonjs(),
        ]
      }).then(bundle => {
        bundle.write({
          file: './dist/'+file.basename,
          format: 'es'
        });

        return cb(null, file);
      });


      // const bundle = await rollup({
      //   input: 'js/player-chrome.js',
      //   plugins: [
      //     minify({
      //       comments: false
      //     }),
      //     resolve(),
      //     commonjs(),
      //   ]
      // });
      //
      // return bundle.write({
      //   file: pkg.main,
      //   format: 'es'
      // });
      //
      //
      // if (file.isBuffer()) {
      //   console.log(file.basename);
      // }

      // cb(null, file);
    }))
    .pipe(dest('output/'));

  // src('js/*.js')
  //   .pipe(each(function(content, file, callback) {
  //     console.log(Object.keys(file), file.stat);
  //
  //     callback(null, content);
  //   }));

  // const bundle = await rollup({
  //   input: 'js/player-chrome.js',
  //   plugins: [
  //     minify({
  //       comments: false
  //     }),
  //     resolve(),
  //     commonjs(),
  //   ]
  // });
  //
  // return bundle.write({
  //   file: pkg.main,
  //   format: 'es'
  // });
}
