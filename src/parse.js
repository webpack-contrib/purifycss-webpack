function parsePaths(paths) {
  const ret = paths || [];

  // Convert possible string to an array
  if (typeof ret === 'string') {
    return [ret];
  }

  return ret;
}

module.exports = {
  paths: parsePaths
};
