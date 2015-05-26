var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var DemoPlugin = require('../');
var S = require('string');

var inputFolder = path.join(__dirname, 'fixtures');
var inputFile = path.join(inputFolder, 'entry.js');
var outputFolder = path.join(__dirname, 'output');
var outputFile = path.join(outputFolder, 'bundle.js');

var options = {
  chunkModules: true,
  exclude: [/node_modules[\\\/]/]
};

var compiler = webpack({
  entry: inputFile,

  output: {
    path: outputFolder,
    filename: "bundle.js"
  },

  loaders: [{
    test: /\.css$/,
    loader: "style!css"
  }],

  plugins: [
    new DemoPlugin(path.join(__dirname), {
      chunkModules: true,
    })
  ]
});

module.exports.tests = {

  'bundle includes all css classes': function(test) {
    compiler.run(function(err, stats) {
      var expected = ["body", "p"];
      var actual = fs.readFileSync(outputFile, 'utf-8');

      var allPass = expected.every(function(className) {
          return S(actual).contains(className)
        });

      test.ok(allPass, "bundle includes all css classes");
      test.done();
    })
  },

  'bundle does not include css classes not in source html/js': function(test) {
    compiler.run(function(err, stats) {
      var expected = ["video", "span", "div", "h1", "h2", "button"];
      var actual = fs.readFileSync(outputFile, 'utf-8');

      var allPass = expected.every(function(className) {
          return !S(actual).contains(className)
        });

      test.ok(allPass, "bundle does not include css classes not in source html/js");
      test.done();
    });
  }

};