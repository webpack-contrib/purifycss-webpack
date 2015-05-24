var DemoPlugin = require('./plugin.js');
var path = require('path');

module.exports = {
  entry: "./entry.js",
  output: {
    path: __dirname,
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

};