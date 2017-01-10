const purify = require('purify-css');
const ConcatSource = require('webpack-sources').ConcatSource;

function purifyCSS(files, assets, purifyOptions) {
  return assets.map(({ key, asset }) => {
    const css = asset.source();
    const source = new ConcatSource();

    source.add(purify(files, css, purifyOptions));

    return { key, source };
  })
}

module.exports = purifyCSS;
