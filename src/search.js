const path = require('path');

function searchAdditionalFiles(fileDependencies, resolveExtensions) {
  return Object.keys(fileDependencies).map((key) => {
    const file = fileDependencies[key];
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
