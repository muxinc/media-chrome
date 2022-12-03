import { assert } from '@open-wc/testing';
import { subscript } from '../../../src/js/utils/subscript.js';

describe('subscript', () => {
  it('can evaluate a simple boolean condition', () => {
    assert(subscript('true')());
    assert(subscript('!false')());
    assert(subscript('true == myVar')({ myVar: true }));
    assert(subscript('myVar != false')({ myVar: true }));
  });

  it('can evaluate a simple number condition', async () => {
    assert(!subscript('0')());
    assert(subscript('1')());
    assert(subscript('myVar == 1234567890')({ myVar: 1234567890 }));
    assert(subscript('myVar != 22')({ myVar: 23 }));
    assert(subscript('5 > 4')());
    assert(subscript('5 >= 5')());
    assert(subscript('2 < 4')());
    assert(!subscript('2 > 4')());
    assert(subscript('myVar >= 22')({ myVar: 23 }));
  });

  it('can evaluate a simple string condition', async () => {
    assert(!subscript('""')());
    assert(subscript('"thruthy"')());
    assert(subscript("'thruthy'")());
    assert(subscript('myVar == "a string"')({ myVar: 'a string' }));
    assert(subscript("myVar == 'a string'")({ myVar: 'a string' }));
    assert(subscript('myVar != "a string"')({ myVar: 'lalala' }));
  });

  it('can evaluate a sequence condition', async () => {
    assert(subscript('false || true')());
    assert(subscript('99 && true')());
    assert(subscript('4 > 3 && !null')());
    assert(subscript('undefined || myVar == 22')({ myVar: 22 }));
    assert(subscript('width > 480 && height < width')({ width: 640, height: 360 }));
  });

  it('works with built-in filters', async () => {
    assert.equal(subscript('myVar | string')({ myVar: true }), 'true');
    assert.equal(subscript('myVar | boolean')({ myVar: 1 }), true);
    assert.equal(subscript('myVar | number')({ myVar: '66' }), 66);
  });
});
