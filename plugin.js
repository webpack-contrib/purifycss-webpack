var fs = require('fs');

var DemoPlugin = function(output, options) {
  this.output = output;
  this.options = options;

  console.log('hi from constructor');

};

module.exports = DemoPlugin;

DemoPlugin.prototype.apply = function(compiler) {

  compiler.plugin('compilation', function(compilation) {

    compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
      var modules = [];

      chunks.forEach(function(chunk) {
        chunk.modules.forEach(function(module) {
          modules.push(module._source);
        });
      });//end chunks.forEach
      console.log(modules);
    })//end compilation.plugin

  });//end compiler.plugin
};