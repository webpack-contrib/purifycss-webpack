const parse = require('./parse');
const purifyCSS = require('./purify-css');
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
          const { assets, chunks, fileDependencies } = compilation;

          (chunks.length === 1 || Array.isArray(paths) ?
            purifyCSS(
              paths.concat(
                search.files(fileDependencies, extensions)
              ),
              search.assets(assets, /\.css$/i),
              purifyOptions
            ) :
            [].concat(...chunks.map(
              ({ name, modules }) => purifyCSS(
                paths[name].concat(
                  search.files(modules, extensions, file => file.resource)
                ),
                search.assets(assets, /\.css$/i).filter(
                  asset => asset.name.indexOf(name) >= 0
                ),
                purifyOptions
              )
            ))
          ).forEach(({ name, source }) => {
            assets[name] = source;
          });

          cb();
        });
      });
    }
  };
};
