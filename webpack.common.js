const path = require('path');

module.exports = {
  entry: {
    'media-chrome-core': './src/js/index.js',
    'media-clip-selector': './src/js/extras/media-clip-selector/index.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
};
