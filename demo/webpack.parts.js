const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const PurifyCSSPlugin = require('../');

exports.extractCSS = function extractCSS(paths) {
  return {
    module: {
      rules: [
        // Extract CSS during build
        {
          test: /\.css$/,
          // Restrict extraction process to the given
          // paths.
          include: paths,

          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader'
          })
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].css')
    ]
  };
};

exports.purifyCSS = function purifyCSS(paths) {
  return {
    plugins: [
      new PurifyCSSPlugin({
        // `paths` is used to point PurifyCSS to files not
        // visible to webpack. This expects an array of individual paths.
        paths: [].concat.apply(
          [],
          (Array.isArray(paths) ? paths : [paths]).map(
            path => glob.sync(`${path}/*`)
          )
        ),

        // Walk through only html files within node_modules. It
        // picks up .js files by default!
        resolveExtensions: ['.html']
      })
    ]
  };
};
