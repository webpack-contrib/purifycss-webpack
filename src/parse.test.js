const assert = require('assert');
const parse = require('./parse');

describe('Parse paths', function () {
  it('returns an empty array by default', function () {
    assert.deepEqual(parse.paths(), []);
  });

  it('returns an object as itself', function () {
    const o = { a: ['a', 'b', 'c'] };

    assert.deepEqual(parse.paths(o), o);
  });

  it('puts a string inside an array', function () {
    const str = 'foobar';

    assert.deepEqual(parse.paths(str), [str]);
  });
});
