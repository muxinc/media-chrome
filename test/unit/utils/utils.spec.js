import { assert } from '@open-wc/testing';
import {
  isNumericString,
  isValidNumber,
  camelCase,
  constToCamel,
} from '../../../src/js/utils/utils.js';

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

describe('isValidNumber', () => {
  it('returns false on non numbers', () => {
    assert(!isValidNumber({}));
    assert(!isValidNumber([1]));
    assert(!isValidNumber(true));
    assert(!isValidNumber(NaN));
    assert(!isValidNumber(() => {}));
  });

  it('returns true on numbers', () => {
    assert(isValidNumber(1));
    assert(isValidNumber(1.5));
    assert(isValidNumber(1e10));
    assert(isValidNumber(0x10));
  });
});

describe('camelCase', () => {
  it('translates snake case to camel case', () => {
    assert.equal(camelCase('my_cool_prop'), 'myCoolProp');
  });

  it('translates kebab case to camel case', () => {
    assert.equal(camelCase('my-cool-prop'), 'myCoolProp');
  });
});

describe('constToCamel', () => {
  it('translates snake case to camel case', () => {
    assert.equal(constToCamel('my_cool_prop'), 'myCoolProp');
  });

  it('translates snake case to camel case w/ first uppercase ', () => {
    assert.equal(constToCamel('my_cool_prop', true), 'MyCoolProp');
  });
});
