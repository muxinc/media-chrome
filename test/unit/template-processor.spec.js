import { assert } from '@open-wc/testing';
import { evaluateCondition } from '../../src/js/theme/template-processor.js';

describe('template processor', () => {
  it('can evaluate a simple boolean condition', () => {
    assert(evaluateCondition('true'));
    assert(evaluateCondition('true == myVar', { myVar: true }));
    assert(evaluateCondition('myVar != false', { myVar: true }));
  });

  it('can evaluate a simple number condition', async () => {
    assert(!evaluateCondition('0'));
    assert(evaluateCondition('1'));
    assert(evaluateCondition('myVar == 22', { myVar: 22 }));
    assert(evaluateCondition('myVar != 22', { myVar: 23 }));
  });

  it('can evaluate a simple string condition', async () => {
    assert(!evaluateCondition('""'));
    assert(evaluateCondition('"thruthy"'));
    assert(evaluateCondition('myVar == "a string"', { myVar: 'a string' }));
    assert(evaluateCondition('myVar != "a string"', { myVar: 'lalala' }));
  });
});
