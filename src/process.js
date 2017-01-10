const purifyCSS = require('./purify-css');
const search = require('./search');

function processSingle({
  paths, dependencies, resolveExtensions, assets, purifyOptions
}) {
  return purifyCSS(
    paths.concat(
      search.additionalFiles(
        dependencies, resolveExtensions
      )
    ),
    search.assets(assets, /\.css$/i),
    purifyOptions
  );
}

function processEntries({
  paths, resolveExtensions, chunks, assets, purifyOptions
}) {
  return [].concat.apply([], chunks.map(chunk => (
    purifyCSS(
      paths[chunk.name].concat(
        search.additionalFiles(
          chunk.modules, resolveExtensions, ({ resource }) => resource
        )
      ),
      search.assets(assets, /\.css$/i).filter(
        ({ key }) => key.indexOf(chunk.name) >= 0
      ),
      purifyOptions
    )
  )));
}

module.exports = {
  single: processSingle,
  entries: processEntries
};
