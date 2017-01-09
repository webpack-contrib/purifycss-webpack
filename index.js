const purify = require('purify-css');
const path = require('path');
const ConcatSource = require('webpack-sources').ConcatSource;

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

    // Purify options
    self.purifyOptions = self.userOptions.purifyOptions || {
      minify: false,
      info: wpOptions.debug || false
    };
    self.purifyOptions.output = false;

    // An array of files to check.
    self.paths = self.userOptions.paths || [];

    // Convert possible string to an array
    if (typeof self.paths === 'string') {
      self.paths = [self.paths];
    }

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

function searchAdditionalFiles(fileDependencies, resolveExtensions) {
  return Object.keys(fileDependencies).map((key) => {
    const file = fileDependencies[key];
    const ext = path.extname(file);

    if (resolveExtensions.indexOf(ext) >= -1) {
      return file;
    }

    return null;
  }).filter(a => a);
}

function purifyCSS(files, assets, purifyOptions) {
  return Object.keys(assets).map((key) => {
    if (/\.css$/i.test(key)) {
      const asset = assets[key];
      const css = asset.source();
      const value = new ConcatSource();

      value.add(purify(files, css, purifyOptions));

      return { key, value };
    }

    return null;
  }).filter(a => a);
}
