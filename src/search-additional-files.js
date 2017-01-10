const path = require('path');

function searchAdditionalFiles(fileDependencies, resolveExtensions) {
  return Object.keys(fileDependencies).map((key) => {
    const file = fileDependencies[key];
    const ext = path.extname(file);

    if (resolveExtensions.indexOf(ext) >= 0) {
      return file;
    }

    return null;
  }).filter(a => a);
}

module.exports = searchAdditionalFiles;
