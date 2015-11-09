# PurifyCSS WebPack Plugin

This is a plugin for WebPack that utilizes PurifyCSS to clean your CSS. Its dead simple, but it requires you to be prepared.

So, let's go and clean some style!

## Dependencies
- WebPack must be already installed, so that this plugin can use it's library parts.
- You **should** use the `extract-text-webpack-plugin` - although, you are not enforced to. Without any CSS file being emitted as an asset, this plugin will not do a thing except idle about inside the compiler. You can also use the `file` plugin to drop a special CSS file into your output folder, but I highly recommend the extract plugin.

## Use
First, get it:

    npm install --save bird3-purifycss-webpack-plugin

Let's assume you have a basic webpack configuration like so:

```javascript
var extractor = require("extract-text-webpack-plugin");
module.exports = {
    entry: "app.js",
    output: {
        // ...
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: extractor.loader("style","css") }
        ]
    },
    plugins: [
        new extractor("[name].css")
    ]
}
```

Now, all we add, is another plugin definition. Please note: Plugins seem to be executed in order, so make sure that this plugin comes _after_ the extract plugin, if you use it.

```javascript
var extractor = require("extract-text-webpack-plugin");
var purify = require("bird3-purifycss-webpack-plugin");
module.exports = {
    entry: "app.js",
    output: {
        // ...
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: extractor.loader("style","css") }
        ]
    },
    plugins: [
        new extractor("[name].css"),
        new purify({
            basePath: __dirname,
            paths: [
                "app/views/*.html",
                "app/layout/*.html"
            ]
        })
    ]
}
```

And, that's it! Your scripts and view files will be scanned for classes, and those that are unused will be stripped off your CSS - aka. "purified".

## Options
This plugin, unlike the original PurifyCSS plugin, provides special features, such as scanning the dependency files and all kinds of files. To configure such behaviours, I will show you the options.

Property      | Description
---------------------------
`basePath`    | The path from which all the other paths will start. Required.
`scanForExts` | An array of extensions that should be given to PurifyCSS when determining classes. Defaults to: `.js`
`paths`       | An array of globs that reveal all your files. See [glob](http://npmjs.org/glob)'s documentation to see what kind of paths you can pass in this array. Use this array to pass files that won't be known to WebPack. Required.

## Notes
This plugin is NOT a fork of [the offical plugin](https://github.com/purifycss/purifycss-webpack-plugin)! Instead, this is it's own. I prefixed it with `bird3`, since it was created within my [BIRD3](https://github.com/DragonsInn/BIRD3) project and to make an obvious separation to the offical version.
