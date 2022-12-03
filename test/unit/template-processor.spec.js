import { assert } from '@open-wc/testing';
import { getParamValue } from '../../src/js/utils/template-processor.js';

describe('getParamValue', () => {
  it('gets the correct value from string', () => {
    assert.equal(getParamValue('true'), true);
    assert.equal(getParamValue('false'), false);
    assert.equal(getParamValue('"hello world"'), 'hello world');
    assert.equal(getParamValue("'hello world'"), 'hello world');
    assert.equal(getParamValue('360'), 360);
    assert.equal(getParamValue('myVar', { myVar: 'val' }), 'val');
  });
});
