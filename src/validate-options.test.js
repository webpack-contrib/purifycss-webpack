const assert = require('assert');
const validateOptions = require('./validate-options').default;
const schema = require('./schema').default;

describe('Validate options', function () {
  it('fails without a schema and data', function () {
    assert.throws(
      () => {
        validateOptions();
      },
      Error
    );
  });

  it('fails with empty data', function () {
    const result = validateOptions(schema());

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('does not fail if paths are provided', function () {
    const result = validateOptions(schema(), { paths: ['./foo'] });

    assert.ok(result.isValid);
    assert.ok(!result.error);
  });

  it('does not allow arbitrary properties', function () {
    const result = validateOptions(schema(), { paths: ['./foo'], foobar: ['./foo'] });

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('styleExtensions have defaults', function () {
    const paths = ['./foo'];
    const data = { paths };

    // Currently this mutates data with defaults due to ajv design. It
    // might be a good idea to change that behavior, though.
    const result = validateOptions(schema(), data);

    assert.deepEqual(data, { paths, styleExtensions: ['.css'] });
    assert.ok(!result.error);
  });

  it('fails without matching path keys', function () {
    const data = {
      paths: {
        a: './foo'
      }
    };

    const result = validateOptions(schema({
      entry: {
        b: './bar'
      }
    }), data);

    assert.ok(result.error);
  });
});
