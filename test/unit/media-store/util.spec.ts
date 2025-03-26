import { assert } from '@open-wc/testing';
import { areValuesEq } from '../../../src/js/media-store/util.js';

describe('areValuesEq', () => {
  it('returns false on different nil values', () => {
    assert(!areValuesEq(null, undefined));
  });

  it('returns true on equal nil values', () => {
    assert(areValuesEq(null, null));
    assert(areValuesEq(undefined, undefined));
  });

  it('returns false on different types', () => {
    assert(!areValuesEq(1, '1'));
  });

  it('returns false on different values', () => {
    assert(!areValuesEq(1, 2));
  });

  it('returns true on equal values', () => {
    assert(areValuesEq(1, 1));
  });

  it('returns true on equal NaN values', () => {
    assert(areValuesEq(NaN, NaN));
  });

  it('returns false on different number values', () => {
    assert(!areValuesEq(NaN, 1));
  });

  it('returns false on different array lengths', () => {
    assert(!areValuesEq([1], [1, 2]));
  });

  it('returns false on different array values', () => {
    assert(!areValuesEq([1], [2]));
  });

  it('returns true on equal array values', () => {
    assert(areValuesEq([1], [1]));
  });

  it('returns false on different object values', () => {
    assert(!areValuesEq({ a: 1 }, { a: 2 }));
  });

  it('returns true on equal object values', () => {
    assert(areValuesEq({ a: 1 }, { a: 1 }));
  });

  it('returns false on different object keys', () => {
    assert(!areValuesEq({ a: 1 }, { b: 1 }));
  });

  it('returns false on different object key values', () => {
    assert(!areValuesEq({ a: 1 }, { a: 2 }));
    assert(!areValuesEq({ a: 1 }, null));
    assert(!areValuesEq(null, { a: 2 }));
  });

  it('returns false on different object key types', () => {
    assert(!areValuesEq({ a: 1 }, { a: '1' }));
  });
});
