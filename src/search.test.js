const assert = require('assert');
const search = require('./search');

describe('Search assets', function () {
  it('returns nothing if nothing is passed', function () {
    assert.deepEqual(search.assets(), []);
  });

  it('returns matches based on a pattern', function () {
    const modules = {
      'foobar.txt': {},
      'barbar.css': {}
    };
    const extensions = ['.txt'];
    const matches = [{ name: 'foobar.txt', asset: {} }];

    assert.deepEqual(search.assets(modules, extensions), matches);
  });

  it('returns matches if they have query', function () {
    const modules = {
      'foobar.txt?123': {},
      'barbar.css': {}
    };
    const extensions = ['.txt'];
    const matches = [{ name: 'foobar.txt?123', asset: {} }];

    assert.deepEqual(search.assets(modules, extensions), matches);
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

  it('does not fail with missing modules', function () {
    const modules = ['foobar.txt', '', 'barbar.css'];
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
      search.files(modules, extensions, file => file.resource),
      matches
    );
  });

  it('does not fail with missing modules when a getter fails', function () {
    const modules = {
      foobar: {
        resource: 'foobar.txt'
      },
      demo: {},
      barbar: {
        resource: 'barbar.css'
      }
    };
    const extensions = ['.txt'];
    const matches = ['foobar.txt'];

    assert.deepEqual(
      search.files(modules, extensions, file => file.resource),
      matches
    );
  });
});
