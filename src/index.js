const searchAdditionalFiles = require('./search-additional-files');
const parse = require('./parse');
const purifyCSS = require('./purify-css');

module.exports = function PurifyPlugin(options) {
  // Store the user's options
  this.userOptions = options;
};

module.exports.prototype.apply = function apply(compiler) {
  compiler.plugin('this-compilation', (compilation) => {
    const paths = parse.paths(this.userOptions.paths);

    // Additional extensions to scan for. This is kept minimal.
    const resolveExtensions = (
      this.userOptions.resolveExtensions || compiler.options.resolve.extensions
    );

    compilation.plugin('additional-assets', (cb) => {
      // Check only if there is one chunk and if paths are an array
      if (compilation.chunks.length === 1 || Array.isArray(paths)) {
        purifyCSS(
          // Look for additional files
          paths.concat(
            searchAdditionalFiles(compilation.fileDependencies, resolveExtensions)
          ),
          compilation.assets,
          parse.options(this.userOptions.purifyOptions)
        ).forEach((o) => {
          compilation.assets[o.key] = o.value;
        });
      }

      cb();
    });
  });
};
