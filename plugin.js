var fs = require('fs');

var DemoPlugin = function(output, options) {
  this.output = output;
  this.options = options;

  console.log('hi from constructor');

};

module.exports = DemoPlugin;

DemoPlugin.prototype.apply = function(compiler) {

  compiler.plugin('compile', function(params) {
    console.log('hi from compiler');


  });
};

