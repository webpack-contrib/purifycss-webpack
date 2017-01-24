const assert = require('assert');
const validateOptions = require('../src/validate-options').default;

describe('Validate options', function () {
  it('fails empty data', function () {
    const result = validateOptions();

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('fails empty data', function () {
    const result = validateOptions({});

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('does not fail if paths are provided', function () {
    const result = validateOptions({ paths: ['./foo'] });

    assert.ok(result.isValid);
    assert.ok(!result.error);
  });

  it('does not allow arbitrary properties', function () {
    const result = validateOptions({ paths: ['./foo'], foobar: ['./foo'] });

    assert.ok(!result.isValid);
    assert.ok(result.error);
  });

  it('fileExtensions have defaults', function () {
    const paths = ['./foo'];
    const data = { paths };

    // Currently this mutates data with defaults due to ajv design. It
    // might be a good idea to change that behavior, though.
    const result = validateOptions(data);

    assert.deepEqual(data, { paths, fileExtensions: ['.css'] });
    assert.ok(!result.error);
  });
});
