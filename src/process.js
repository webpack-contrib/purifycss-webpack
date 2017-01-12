const purifyCSS = require('./purify-css');
const search = require('./search');

function processSingle({
  paths, dependencies, extensions, assets, purifyOptions
}) {
  return purifyCSS(
    paths.concat(
      search.files(dependencies, extensions)
    ),
    search.assets(assets, /\.css$/i),
    purifyOptions
  );
}

function processEntries({
  paths, extensions, chunks, assets, purifyOptions
}) {
  return [].concat.apply([], chunks.map(chunk => (
    purifyCSS(
      paths[chunk.name].concat(
        search.files(chunk.modules, extensions, file => file.resource)
      ),
      search.assets(assets, /\.css$/i).filter(
        ({ name }) => name.indexOf(chunk.name) >= 0
      ),
      purifyOptions
    )
  )));
}

module.exports = {
  single: processSingle,
  entries: processEntries
};
