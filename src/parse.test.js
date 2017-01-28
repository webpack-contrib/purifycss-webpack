const assert = require('assert');
const parse = require('./parse');

describe('Parse entry paths', function () {
  it('returns an empty array by default', function () {
    assert.deepEqual(parse.entryPaths(), []);
  });

  it('returns an object as itself', function () {
    const o = { a: ['a', 'b', 'c'] };

    assert.deepEqual(parse.entryPaths(o), o);
  });

  it('puts a string inside an array', function () {
    const str = 'foobar';

    assert.deepEqual(parse.entryPaths(str), [str]);
  });
});

describe('Parse entries', function () {
  it('returns paths if there is no chunk name', function () {
    const paths = ['a', 'b', 'c'];

    assert.deepEqual(parse.entries(paths), paths);
  });

  it('returns paths if paths are an array already', function () {
    const paths = ['a', 'b', 'c'];

    assert.deepEqual(parse.entries(paths, 'foobar'), paths);
  });

  it('returns chunk paths', function () {
    const entryPaths = ['a', 'b', 'c'];
    const paths = {
      foobar: entryPaths
    };

    assert.deepEqual(parse.entries(paths, 'foobar'), entryPaths);
  });

  it('returns chunk path wrapped in an array', function () {
    const entryPaths = 'a';
    const paths = {
      foobar: entryPaths
    };

    assert.deepEqual(parse.entries(paths, 'foobar'), [entryPaths]);
  });

  it('returns an empty array if failed to find entry', function () {
    const paths = {
      foobar: 'a'
    };

    assert.deepEqual(parse.entries(paths, 'barbar'), []);
  });

  it('returns an empty array if failed to find entry with multiple paths', function () {
    const paths = {
      foobar: 'a',
      barbar: 'b'
    };

    assert.deepEqual(parse.entries(paths, 'foofoo'), []);
  });
});
