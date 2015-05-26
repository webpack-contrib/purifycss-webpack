var fs = require('fs');
var purify = require('./node_modules/purify-css/purifycss.js');
var S = require('string');

var DemoPlugin = function(output, options) {
  this.output = output;
  this.options = options;
};

module.exports = DemoPlugin;

DemoPlugin.prototype.apply = function(compiler) {

  compiler.plugin('compilation', function(compilation) {

    compilation.plugin("optimize-modules", function(modules) {
      var content = [];
      var css = [];

      //get all html/js contents
      modules.forEach(function(module) {
        //check if filepath does not contain node_modules
        var filepath = module._source._name;
        var sourcecode = module._source._value;

        if (!S(filepath).contains('node_modules')) {
          //concat path to content array
          content.push(sourcecode);
        }
      })

      content = content.join("");

      modules.forEach(function(module) {
        //iterate over modules
        var filepath = module._source._name;
        var sourcecode = module._source._value;

        //skip over files loaded by style-loader
        if (S(filepath).contains('!') && !S(filepath).contains('style-loader')) {
          //parse sourcecode for only css
          var css = S(sourcecode).between('module.id, ',', ""]);').s;

          //pass css and content array into kenny's function
          var uncss = purify(content, eval(css), {write: false, minify: false});

          //stringify purified css
          uncss = JSON.stringify(uncss);

          //insert back into module
          module._source._value = sourcecode.replace(css, uncss)
          console.log('-----MODULE------',module._source._value);
        }
        
      }) //end modules.forEach

    }); //end compiler.plugin

  });
}