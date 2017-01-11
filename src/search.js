const path = require('path');

function searchAssets(assets = [], pattern) {
  return Object.keys(assets).map(
    key => pattern.test(key) && { key, asset: assets[key] }
  ).filter(a => a);
}

function searchFiles(
  modules = {},
  extensions = [],
  getter = a => a
) {
  return Object.keys(modules).map((key) => {
    const file = getter(modules[key]);

    return extensions.indexOf(path.extname(file)) >= 0 && file;
  }).filter(a => a);
}

module.exports = {
  assets: searchAssets,
  files: searchFiles
};
