const path = require('path');

function searchAssets(
  assets = [],
  extensions = []
) {
  return Object.keys(assets).map(
    name => {
      var nameCleaned = name;
      if (/\.(css\?).*$/.test(name)) {
        nameCleaned = name.substr(0, name.lastIndexOf('?')); // ignore hash on file like style.css?7ec000f0d0d347
      }
      extensions.indexOf(path.extname(nameCleaned)) >= 0 && { name, asset: assets[name] }
    }
  ).filter(a => a);
}

function searchFiles(
  modules = {},
  extensions = [],
  getter = a => a
) {
  return Object.keys(modules).map((name) => {
    const file = getter(modules[name]);

    if (!file) {
      return null;
    }

    return extensions.indexOf(path.extname(file)) >= 0 && file;
  }).filter(a => a);
}

module.exports = {
  assets: searchAssets,
  files: searchFiles
};
