const purify = require('purify-css');
const ConcatSource = require('webpack-sources').ConcatSource;
const parse = require('./parse');
const search = require('./search');

module.exports = function PurifyPlugin(options) {
  return {
    apply(compiler) {
      compiler.plugin('this-compilation', (compilation) => {
        const paths = parse.paths(options.paths);
        const extensions = options.extensions || compiler.options.resolve.extensions;

        compilation.plugin('additional-assets', (cb) => {
          [].concat(...compilation.chunks.map(
            ({ name: chunkName, modules }) => (
              search.assets(compilation.assets, /\.css$/i).filter(
                asset => asset.name.indexOf(chunkName) >= 0
              ).forEach(({ name, asset }) => {
                compilation.assets[name] = new ConcatSource(
                  purify(
                    (paths[chunkName] || paths).concat(
                      search.files(modules, extensions, file => file.resource)
                    ),
                    asset.source(),
                    options.purifyOptions
                  )
                );
              })
            )
          ));

          cb();
        });
      });
    }
  };
};
