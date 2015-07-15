* [PurifyCSS](https://github.com/purifycss/purifycss) plugin/loader for webpack.

# Installation
```
npm install purifycss-loader
```

# Usage
``` javascript
var PurifyCssPlugin = require('purifycss-loader/PurifyCssPlugin');

var webpackConfig = {
  // ...

  module: {
    loaders: [{
      test: /\.css$/, loader: "style-loader!css-loader!purifycss-loader"
    }]
  },

  plugins: [
    new PurifyCssPlugin(__dirname, '/index.html')
  ]
}
```

# API
Pass in the filepath to the root html for us to detect classes there. PurifyCSS will look at all your bundles on its own.
