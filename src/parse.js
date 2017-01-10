function parseOptions(options, debug) {
  const ret = options || {
    minify: false,
    info: debug
  };
  ret.output = false;

  return ret;
}

function parsePaths(paths) {
  const ret = paths || [];

  // Convert possible string to an array
  if (typeof ret === 'string') {
    return [ret];
  }

  return ret;
}

module.exports = {
  options: parseOptions,
  paths: parsePaths
};
