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
        self.entryPaths = self.userOptions.entryPaths || [];
        // Additional extensions to scan for. This is kept minimal, for obvious reasons.
        // We are not opinionated...
        self.resolveExtensions = self.userOptions.resolveExtensions || compiler.options.resolve.extensions;

        var files = self.paths.reduce(function(results, p) {
          return results.concat(glob(path.join(self.basePath, p)));
        }, []);

        compilation.plugin("additional-assets", function(cb){
            if (compilation.chunks.length === 1 && compilation.chunks[0].name === 'main') {
                // main chunk
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
                        executePurification(files, asset, key);
                    }
                }
            } else {
                // multiple entry chunks
                var cssAsset;
                var assets = Object.keys(compilation.assets);

                compilation.chunks.forEach(function (chunk, i) {
                    // extract html chunk files
                    var key;
                    var error = false;

                    if (self.entryPaths[chunk.name]) {
                        var chunkFiles = self.entryPaths[chunk.name].reduce(function (results, p) {
                            return results.concat(glob(path.join(self.basePath, p)));
                        }, []);   
                    } else {
                        console.log('Wrong entryPath for ' + chunk.name);
                        error = true;
                    }

                    // filter chunk modules for additional files to include ex. .js, .es6,...
                    var chunkModules = chunk.modules.filter(function (module) {
                        var ext = path.extname(module.resource);
                        return self.resolveExtensions.indexOf(ext) > -1;
                    });

                    // include additional modules
                    chunkFiles.concat(chunkModules);

                    // find css asset
                    for (var k = 0; k < assets.length; k++){
                        if (assets[k].indexOf(chunk.name) > -1 && path.extname(assets[k]) === '.css') {
                            cssAsset = compilation.assets[assets[k]];
                            key = assets[k];
                            break;
                        }
                    }

                    if (cssAsset && !error) {
                        if (self.purifyOptions.info) {
                            console.log(chunk.name);
                        }

                        executePurification(chunkFiles, cssAsset, key);
                    } else {
                        console.log('No CSS for chunk: ' + chunk.name);
                    }
                });
            }

            function executePurification(files, cssAsset, key) {
                var css = cssAsset.source();
                var newCss = new ConcatSource();

                newCss.add(purify(files, css, self.purifyOptions));
                compilation.assets[key] = newCss;
            }

            cb();
        });
    });
}
