var purify = require("purify-css");
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
        // webpack options
        var wpOptions = compilation.compiler.options;

        // Purify options
        self.purifyOptions = self.userOptions.purifyOptions || {
            minify: false,
            info:   wpOptions.debug || false
        };
        self.purifyOptions.output = false;

        // Path/files to check. If none supplied, an empty array will do.
        // This can be an object too (entry -> [paths])
        self.paths = self.userOptions.paths || [];

        // Additional extensions to scan for. This is kept minimal, for obvious reasons.
        // We are not opinionated...
        self.resolveExtensions = self.userOptions.resolveExtensions || compiler.options.resolve.extensions;

        var files = self.paths;

        compilation.plugin("additional-assets", function(cb){
            // check if there is only one chunk if array
            if (compilation.chunks.length === 1 || Array.isArray(self.paths)) {
                // Look for additional JS/HTML stuff.
                for(var key in compilation.fileDependencies) {
                    var file = compilation.fileDependencies[key];
                    var ext = path.extname(file);

                    if (self.resolveExtensions.indexOf(ext) > -1) {
                        files.push(file);
                    }
                }

                // Look for purifyable CSS...
                for(var key in compilation.assets) {
                    if(/\.css$/i.test(key)) {
                        // We found a CSS. So purify it.
                        executePurification(files, key);
                    }
                }
            } else {
                // multiple entry chunks
                var assets = Object.keys(compilation.assets);

                compilation.chunks.forEach(function (chunk) {
                    var key;

                    if (self.paths[chunk.name]) {
                        // extract html chunk files
                        var chunkFiles = self.paths[chunk.name];

                        // filter chunk modules for additional files to include ex. .js, .es6,...
                        for (var j = 0; j < chunk.modules.length; j++) {
                            var ext = path.extname(chunk.modules[j].resource);
                            if (self.resolveExtensions.indexOf(ext) > -1) {
                                chunkFiles.push(chunk.modules[j].resource);
                            }
                        }

                        // find CSS asset
                        for (var i = 0; i < assets.length; i++){
                            if (assets[i].indexOf(chunk.name) > -1 && path.extname(assets[i]) === '.css') {
                                key = assets[i];
                                break;
                            }
                        }

                        if (key) {
                            if (self.purifyOptions.info) {
                                console.log(chunk.name);
                            }

                            executePurification(chunkFiles, key);
                        } else {
                            console.warn('No CSS for chunk: ' + chunk.name);
                        }
                    } else {
                        console.warn('No entryPath for chunk: ' + chunk.name);
                    }
                });
            }

            function executePurification(files, key) {
                var asset = compilation.assets[key];
                var css = asset.source();
                var newCss = new ConcatSource();

                newCss.add(purify(files, css, self.purifyOptions));
                compilation.assets[key] = newCss;
            }

            cb();
        });
    });
}
