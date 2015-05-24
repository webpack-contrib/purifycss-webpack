var DemoPlugin = require('./plugin.js');
var path = require('path');

module.exports = {
  entry: "./entry.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },

  plugins: [
    new DemoPlugin(path.join(__dirname), {
      chunkModules: true,
    })
  ]

};