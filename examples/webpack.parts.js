const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('../');

exports.extractCSS = function extractCSS(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: paths,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader?sourceMap'
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css?[hash]')
    ]
  };
};

exports.purifyCSS = function purifyCSS(options) {
  return {
    plugins: [
      new PurifyCSSPlugin(options)
    ]
  };
};
