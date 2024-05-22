import { assert } from '@open-wc/testing';
import { AttributeTokenList } from '../../../src/js/utils/attribute-token-list.js';

describe('AttributeTokenList', () => {
  it('Add single token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list = [...list];

    assert.deepEqual(list, ['token-1'], 'Assert that tokens is "token-1".');
  });

  it('Add multiple tokenes', function () {
    let list = new AttributeTokenList();

    list.add('token-1', 'token-2');
    list = [...list];

    assert.deepEqual(
      list,
      ['token-1', 'token-2'],
      'Assert that tokens is "token-1" and "token-2".'
    );
  });

  it('Just add token once', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.add('token-1');
    list = [...list];

    assert.deepEqual(
      list,
      ['token-1'],
      'Assert that token was only added once.'
    );
  });

  it('Check contains with a single token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');

    assert.ok(
      list.contains('token-1'),
      'Assert that list contains token "token-1".'
    );
  });

  it('Check contains with multiple tokens', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.add('token-2');

    assert.ok(
      list.contains('token-1'),
      'Assert that list contains token "token-1".'
    );
  });

  it('Check contains with non existing token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');

    assert.equal(
      list.contains('token-2'),
      false,
      'Assert that list does not contains token "token-2".'
    );
  });

  it('Check contains with non existing tokens', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.add('token-2');

    assert.equal(
      list.contains('token-3'),
      false,
      'Assert that list does not contains token "token-3".'
    );
  });

  it('Get item at index', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.add('token-2');

    assert.equal(
      list.item(1),
      'token-2',
      'Assert that "token-2" is at index 1.'
    );
  });

  it('Get item at non existing index', function () {
    let list = new AttributeTokenList();

    list.add('token-1');

    assert.equal(
      list.item(1),
      null,
      'Assert that item() gives null for non existing token.'
    );
  });

  it('Remove single token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.add('token-2');

    list.remove('token-2');
    list = [...list];

    assert.deepEqual(list, ['token-1'], 'Assert that "token-2" was removed.');
  });

  it('Remove multiple tokens', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.add('token-2');

    list.remove('token-1', 'token-2');
    list = [...list];

    assert.deepEqual(
      list,
      [],
      'Assert that "token-1" and "token-2" was removed.'
    );
  });

  it('Remove non-existent token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');

    list.remove('token-3');
    list = [...list];

    assert.deepEqual(
      list,
      ['token-1'],
      'Assert that token list did not change by removing non-existent token.'
    );
  });

  it('Toggle addition of token', function () {
    let list = new AttributeTokenList();

    list.toggle('token-1');
    list = [...list];

    assert.deepEqual(list, ['token-1'], 'Assert that tokens is "token-1".');
  });

  it('Toggle removal of token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.toggle('token-1');
    list = [...list];

    assert.deepEqual(list, [], 'Assert that tokens is empty.');
  });

  it('Toggle removal of token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.toggle('token-1');
    list = [...list];

    assert.deepEqual(list, [], 'Assert that tokens is empty.');
  });

  it('Toggle removal of token', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.toggle('token-1');
    list = [...list];

    assert.deepEqual(list, [], 'Assert that tokens is empty.');
  });

  it('Test toggle force with filled token list', function () {
    let list = new AttributeTokenList();

    list.add('token-1');

    assert.equal(
      list.toggle('token-1', false),
      false,
      'Assert that toggle returns false.'
    );
  });

  it('Test toggle force = true with filled token list', function () {
    let list = new AttributeTokenList();

    list.add('token-1');

    assert.equal(
      list.toggle('token-1', true),
      true,
      'Assert that toggle returns true.'
    );
  });

  it('Test toggle force = true with empty token list', function () {
    let list = new AttributeTokenList();

    assert.ok(list.toggle('token-1', true), 'Assert that toggle returns true.');
  });

  it('Test toggle force = false with empty token list', function () {
    let list = new AttributeTokenList();
    let result = list.toggle('token-12', false);

    list = [...list];

    assert.deepEqual(list, [], 'Assert that token list is empty');
    assert.equal(result, false, 'Assert that toggle returns false.');
  });

  it('Test toString()', function () {
    let list = new AttributeTokenList();

    list.add('token-1', 'token-2');

    assert.equal(
      list.toString(),
      'token-1 token-2',
      'Assert that tokens are space separated.'
    );
  });

  it('Test length after add', function () {
    let list = new AttributeTokenList();

    list.add('token-1');

    assert.equal(list.length, 1, 'Assert that length is 1.');
  });

  it('Test length after remove', function () {
    let list = new AttributeTokenList();

    list.add('token-1');
    list.add('token-2');
    list.add('token-3');

    list.remove('token-1');

    assert.equal(list.length, 2, 'Assert that length is 2.');
  });
});
