import { assert } from '@open-wc/testing';
import { formatAsTimePhrase, formatTime } from '../../../src/js/utils/time.mjs';

describe('formatAsTimePhrase', () => {
  it('formats time in seconds as a phrase', () => {
    assert.equal(formatAsTimePhrase(0), '');
    assert.equal(formatAsTimePhrase(1), '1 second');
    assert.equal(formatAsTimePhrase(176), '2 minutes, 56 seconds');
    assert.equal(formatAsTimePhrase(48932), '13 hours, 35 minutes, 32 seconds');
    assert.equal(formatAsTimePhrase(-3), '3 seconds remaining');
  });
});

describe('formatTime', () => {
  it('formats time', () => {
    assert.equal(formatTime(0), '0:00');
    assert.equal(formatTime(1), '0:01');
    assert.equal(formatTime(176), '2:56');
    assert.equal(formatTime(48932), '13:35:32');
  });
});
