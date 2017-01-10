const searchAdditionalFiles = require('./search-additional-files');
const parse = require('./parse');
const purifyCSS = require('./purify-css');

module.exports = function PurifyPlugin(options) {
  // Store the user's options
  this.userOptions = options;
};

module.exports.prototype.apply = function apply(compiler) {
  // Keep a reference to self
  const self = this;

  // Bind the plugin into this compilation.
  compiler.plugin('this-compilation', (compilation) => {
    // webpack options
    const wpOptions = compilation.compiler.options;

    self.purifyOptions = parse.options(self.userOptions.purifyOptions, wpOptions.debug);
    self.paths = parse.paths(self.userOptions.paths);

    // Additional extensions to scan for. This is kept minimal.
    self.resolveExtensions = (
      self.userOptions.resolveExtensions || compiler.options.resolve.extensions
    );

    const files = self.paths;

    compilation.plugin('additional-assets', (cb) => {
      // Check only if there is one chunk and if paths are an array
      if (compilation.chunks.length === 1 || Array.isArray(self.paths)) {
        purifyCSS(
          // Look for additional files
          files.concat(
            searchAdditionalFiles(compilation.fileDependencies, self.resolveExtensions)
          ),
          compilation.assets
        ).forEach((o) => {
          compilation.assets[o.key] = o.value;
        });
      }

      cb();
    });
  });
};
