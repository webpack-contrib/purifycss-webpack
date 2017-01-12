const purifyCSS = require('./purify-css');
const search = require('./search');

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
  entries: processEntries
};
