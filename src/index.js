const parse = require('./parse');
const purifyCSS = require('./purify-css');
const process = require('./process');
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
          (compilation.chunks.length === 1 || Array.isArray(paths) ?
            purifyCSS(
              paths.concat(
                search.files(compilation.fileDependencies, extensions)
              ),
              search.assets(compilation.assets, /\.css$/i),
              purifyOptions
            ) :
            process.entries({
              paths,
              chunks: compilation.chunks,
              extensions,
              purifyOptions,
              assets: compilation.assets
            })
          ).forEach(({ name, source }) => {
            compilation.assets[name] = source;
          });

          cb();
        });
      });
    }
  };
};
