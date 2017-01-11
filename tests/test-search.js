const assert = require('assert');
const search = require('../src/search');

describe('Search assets', function () {
  it('returns nothing if nothing is passed', function () {
    assert.deepEqual(search.assets(), []);
  });

  it('returns matches based on a pattern', function () {
    const modules = {
      'foobar.txt': {},
      'barbar.css': {}
    };
    const pattern = /\.txt$/i;
    const matches = [{ key: 'foobar.txt', asset: {} }];

    assert.deepEqual(search.assets(modules, pattern), matches);
  });
});

describe('Search files', function () {
  it('returns nothing if nothing is passed', function () {
    assert.deepEqual(search.files(), []);
  });

  it('returns matches based on extension', function () {
    const modules = ['foobar.txt', 'barbar.css'];
    const extensions = ['.txt'];
    const matches = ['foobar.txt'];

    assert.deepEqual(search.files(modules, extensions), matches);
  });

  it('returns matches based on extension with a customized getter', function () {
    const modules = {
      foobar: {
        resource: 'foobar.txt'
      },
      barbar: {
        resource: 'barbar.css'
      }
    };
    const extensions = ['.txt'];
    const matches = ['foobar.txt'];

    assert.deepEqual(
      search.files(modules, extensions, ({ resource }) => resource),
      matches
    );
  });
});
