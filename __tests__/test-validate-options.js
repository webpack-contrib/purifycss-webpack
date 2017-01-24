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
});
