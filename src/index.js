const purify = require('purify-css');
const ConcatSource = require('webpack-sources').ConcatSource;
const parse = require('./parse');
const search = require('./search');

module.exports = function PurifyPlugin(options) {
  return {
    apply(compiler) {
      compiler.plugin('this-compilation', (compilation) => {
        const paths = parse.paths(options.paths);
        const extensions = (
          options.extensions || compiler.options.resolve.extensions
        );
        const purifyOptions = options.purifyOptions;

        compilation.plugin('additional-assets', (cb) => {
          [].concat(...compilation.chunks.map(
            ({ name, modules }) => purifyCSS(
              (paths[name] || paths).concat(
                search.files(modules, extensions, file => file.resource)
              ),
              search.assets(compilation.assets, /\.css$/i).filter(
                asset => asset.name.indexOf(name) >= 0
              ),
              purifyOptions
            )
          )).forEach(({ name, source }) => {
            compilation.assets[name] = source;
          });

          cb();
        });
      });
    }
  };
};

const purifyCSS = (files, assets, purifyOptions) => (
  assets.map(({ name, asset }) => (
    {
      name,
      source: new ConcatSource(purify(files, asset.source(), purifyOptions))
    }
  ))
);
