const search = require('./search');

function processEntries(chunks, process = chunk => chunk) {
  return [].concat.apply([], chunks.map(process));
}

module.exports = processEntries;
