const parse = require('./parse');
const process = require('./process');

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
            process.single({
              paths,
              dependencies: compilation.fileDependencies,
              extensions,
              purifyOptions,
              assets: compilation.assets
            }) :
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
