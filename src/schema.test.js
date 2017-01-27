const assert = require('assert');
const schema = require('./schema').default;

describe('Schema', function () {
  it('converts an object entry to validation', function () {
    const entry = {
      a: 'foo'
    };
    const result = schema({ entry });
    const expected = {
      a: {
        type: ['array', 'string'],
        items: {
          type: 'string'
        }
      }
    };

    assert.deepEqual(result.properties.paths.properties, expected);
  });
});
