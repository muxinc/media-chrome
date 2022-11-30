import { assert } from '@open-wc/testing';
import { evaluateCondition, isNumericString } from '../../src/js/utils/template-processor.js';

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

describe('isNumericString', () => {
  it('returns false on non strings', () => {
    assert(!isNumericString(1));
    assert(!isNumericString({}));
    assert(!isNumericString([1]));
    assert(!isNumericString(true));
    assert(!isNumericString(NaN));
    assert(!isNumericString(() => {}));
  });

  it('returns false on non numeric strings', () => {
    assert(!isNumericString(''));
    assert(!isNumericString(' '));
    assert(!isNumericString('two'));
    assert(!isNumericString('..12'));
    assert(!isNumericString('12px'), '12px is not numeric');
  });

  it('returns true on numeric strings', () => {
    assert(isNumericString('1'));
    assert(isNumericString('1.5'));
    assert(isNumericString('1e10'));
    assert(isNumericString('0x10'));
  });
});
