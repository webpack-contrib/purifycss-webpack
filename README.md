# PurifyCSS Webpack Plugin - Community Version

> **IMPORTANT: This is a friendly fork of [purifycss-webpack-plugin](https://github.com/purifycss/purifycss-webpack-plugin) with a slightly different API.**

This is a plugin for webpack that utilizes [PurifyCSS](https://github.com/purifycss/purifycss) to clean your CSS. You **should** use the [extract-text-webpack-plugin](https://www.npmjs.com/package/extract-text-webpack-plugin) with this.

Without any CSS file being emitted as an asset, this plugin will not do a thing except idle about inside the compiler. You can also use the `file` plugin to drop a special CSS file into your output folder, but it is highly recommend these two plugins together.

## Usage

First, install it:

```bash
npm install @webpack-contrib/purifycss-webpack-plugin --save-dev
```

Then configure as follows:

```javascript
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyPlugin = require('@webpack-contrib/purifycss-webpack-plugin');

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
      paths: glob.sync('app/*.html'),
    })
  ]
};
```

And, that's it! Your scripts and view files will be scanned for classes, and those that are unused will be stripped off your CSS - aka. "purified".

## Options

This plugin, unlike the original PurifyCSS plugin, provides special features, such as scanning the dependency files and all kinds of files. To configure such behaviours, I will show you the options.

| Property            | Description
|---------------------|------------
| `resolveExtensions` | An array of extensions that should be given to PurifyCSS when determining classes. (defaults to webpack `resolve.extensions` config)
| `paths`             | An array of paths to traverse. It can be a good idea [glob](http://npmjs.org/glob) these.
| `purifyOptions`     | Pass [custom options to PurifyCSS](https://github.com/purifycss/purifycss#the-optional-options-argument).

## License

ISC.
