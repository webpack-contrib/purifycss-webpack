var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var DemoPlugin = require('../');

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

module.exports.test = {

  'removes unused css': function(test) {
    compiler.run(function(err, stats) {
      // var expected = JSON.stringify(stats.toJson(options));
      // var actual = fs.readFileSync(outputFile);
      // test.equal(actual, expected);
      console.log('write test');
      test.done();
    });
  }

};