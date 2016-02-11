var purify = require("purify-css");
var glob = require("glob").sync;
var path = require("path");
var ConcatSource = require("webpack-sources").ConcatSource;

module.exports = function PurifyPlugin(options) {
    // Store the user's options
    this.userOptions = options;
}

module.exports.prototype.apply = function(compiler) {
    // Keep a reference to self
    var self = this;

    // Bind the plugin into this compilation.
    compiler.plugin("this-compilation", function(compilation) {
        // WebPack options
        var wpOptions = compilation.compiler.options;
        // Base path
        self.basePath = self.userOptions.basePath || wpOptions.context || process.cwd();
        // Purify options
        self.purifyOptions = self.userOptions.purifyOptions || {
            minify: false,
            info:   wpOptions.debug || false
        };
        self.purifyOptions.output = false;
        // Path/files to check. If none supplied, an empty array will do.
        self.paths = self.userOptions.paths || [];
        // Additional extensions to scan for. This is kept minimal, for obvious reasons.
        // We are not opinionated...
        self.resolveExtensions = self.userOptions.resolveExtensions || compiler.options.resolve.extensions;

        var files = self.paths.reduce(function(results, p) {
          return results.concat(glob(path.join(self.basePath, p)));
        }, []);

        compilation.plugin("additional-assets", function(cb){
            // Look for additional JS/HTML stuff.
            for(var key in compilation.fileDependencies) {
                var file = compilation.fileDependencies[key];
                var ext = path.extname(file);
                if (self.resolveExtensions.indexOf(ext) > -1) files.push(file);
            }

            // Look for purifyable CSs...
            for(var key in compilation.assets) {
                if(/\.css$/i.test(key)) {
                    // We found a CSS. So purify it.
                    var asset = compilation.assets[key];
                    var css = asset.source();
                    var newCss = new ConcatSource();
                    newCss.add(purify(files, css, self.purifyOptions));
                    compilation.assets[key] = newCss;
                }
            }
            cb();
        });
    });
}
