[![build status](https://secure.travis-ci.org/webpack-contrib/purifycss-webpack.svg)](http://travis-ci.org/webpack-contrib/purifycss-webpack) [![bitHound Score](https://www.bithound.io/github/webpack-contrib/purifycss-webpack/badges/score.svg)](https://www.bithound.io/github/webpack-contrib/purifycss-webpack) [![codecov](https://codecov.io/gh/webpack-contrib/purifycss-webpack/branch/master/graph/badge.svg)](https://codecov.io/gh/webpack-contrib/purifycss-webpack)

# PurifyCSS for Webpack

This plugin uses [PurifyCSS](https://github.com/purifycss/purifycss) to remove unused selectors from your CSS. You **should** use it with the [extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin).

Without any CSS file being emitted as an asset, this plugin will do nothing. You can also use the `file` plugin to drop a CSS file into your output folder, but it is highly recommended to use the PurifyCSS plugin with the Extract Text plugin.

> This plugin replaces earlier [purifycss-webpack-plugin](https://www.npmjs.com/package/purifycss-webpack-plugin) and it has a different API!

## Usage

First, install it:

```bash
npm install purifycss-webpack --save-dev
```

Then configure as follows:

```javascript
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyPlugin = require('purifycss-webpack');

module.exports = {
  entry: {...},
  output: {...},
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].[contenthash].css'),
    // Make sure this is after ExtractTextPlugin!
    new PurifyPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'app/*.html')),
    })
  ]
};
```

And, that's it! Your scripts and view files will be scanned for classes, and those that are unused will be stripped off your CSS - aka. "purified".

> You can pass an object (`<entry> -> [<absolute path>]`) to `paths` if you want to control the behavior per entry.

## Options

This plugin, unlike the original PurifyCSS plugin, provides special features, such as scanning the dependency files. You can configure using the following fields:

| Property            | Description
|---------------------|------------
| `extensions` | An array of extensions that should be given to PurifyCSS when determining classes. This defaults to webpack `resolve.extensions` configuration. Often it's a good idea to override this with `['.html']` so it won't traverse `node_modules` `.js` files.
| `paths`             | An array of absolute paths or a path to traverse. This also accepts an object (`<entry name> -> <paths>`). It can be a good idea [glob](http://npmjs.org/glob) these.
| `purifyOptions`     | Pass [custom options to PurifyCSS](https://github.com/purifycss/purifycss#the-optional-options-argument).

> The plugin does **not** emit sourcemaps even if you enable `sourceMap` option on loaders!

## License

ISC.
