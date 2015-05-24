var fs = require('fs');

var DemoPlugin = function(output, options) {
  this.output = output;
  this.options = options;
};

module.exports = DemoPlugin;

DemoPlugin.prototype.apply = function(compiler) {

  compiler.plugin('compilation', function(compilation) {

    compilation.plugin("optimize-modules", function(modules) {
      //iterate over modules
        //check if filepath ends in css
          //split at ! and fs
          //concat file path to css array
        //check if filepath does not contain node_modules
          //concat path to content array
      //pass css and content array into kenny's function
      //store results in uncss array
      //update css modules accordingly

  }); //end compiler.plugin

};