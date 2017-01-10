const path = require('path');

function searchAdditionalFiles(
  modules,
  resolveExtensions,
  getter = a => a
) {
  return Object.keys(modules).map((key) => {
    const file = getter(modules[key]);
    const ext = path.extname(file);

    return resolveExtensions.indexOf(ext) >= 0 && file;
  }).filter(a => a);
}

function searchAssets(assets, pattern) {
  return Object.keys(assets).map(
    key => pattern.test(key) && { key, asset: assets[key] }
  ).filter(a => a);
}

module.exports = {
  additionalFiles: searchAdditionalFiles,
  assets: searchAssets
};
