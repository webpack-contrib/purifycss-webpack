const purify = require('purify-css');
const ConcatSource = require('webpack-sources').ConcatSource;

module.exports = function purifyCSS(files, assets, purifyOptions) {
  return assets.map(({ key, asset }) => (
    {
      key,
      source: new ConcatSource(purify(files, asset.source(), purifyOptions))
    }
  ));
};
