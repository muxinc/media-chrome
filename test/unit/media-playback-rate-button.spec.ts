import { assert, expect, fixture } from '@open-wc/testing';

import '../../src/js/media-playback-rate-button.js';
import MediaPlaybackRateButton from '../../src/js/media-playback-rate-button.js';
import { AttributeTokenList } from '../../src/js/utils/attribute-token-list.js';

describe('<media-playback-rate-button>', () => {
  let el;

  beforeEach(async () => {
    el = await fixture<MediaPlaybackRateButton>(
      `<media-playback-rate-button></media-playback-rate-button>`
    );
  });

  afterEach(() => {
    el = undefined;
  });

  it('passes the a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible();
  });

  it('has the correct default values', () => {
    assert.equal(el.mediaPlaybackRate, '1');

    assert(el.rates instanceof AttributeTokenList);
    assert.equal(el.rates.toString(), '1 1.2 1.5 1.7 2');
  });

  it('sets the playback rates via array', () => {
    el.rates = [0.5, 1, 2];
    assert.equal(el.rates, '0.5 1 2');
  });
});
