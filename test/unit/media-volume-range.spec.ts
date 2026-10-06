import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-volume-range.js';
import MediaVolumeRange from '../../src/js/media-volume-range.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_VOLUME, MEDIA_MUTED, MEDIA_VOLUME_UNAVAILABLE } =
  MediaUIAttributes;

const input = (el: MediaVolumeRange, value: string) => {
  el.range.value = value;
  el.range.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
};

describe('<media-volume-range>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range></media-volume-range>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('defaults', () => {
    let el: MediaVolumeRange;

    beforeEach(async () => {
      el = await fixture<MediaVolumeRange>(
        `<media-volume-range></media-volume-range>`
      );
    });

    it('labels the range input', () => {
      expect(el.range.getAttribute('aria-label')).to.equal(t('volume'));
    });

    it('defaults to full, unmuted volume', () => {
      expect(el.mediaVolume).to.equal(1);
      expect(el.mediaMuted).to.be.false;
      expect(el.mediaVolumeUnavailable).to.equal(null);
    });
  });

  it('reflects the media volume in the range value and aria-valuetext', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range ${MEDIA_VOLUME}="0.5"></media-volume-range>`
    );
    expect(el.range.valueAsNumber).to.equal(0.5);
    expect(el.range.getAttribute('aria-valuetext')).to.equal('50%');

    el.setAttribute(MEDIA_VOLUME, '0.257');
    expect(el.range.valueAsNumber).to.equal(0.257);
    expect(el.range.getAttribute('aria-valuetext')).to.equal('26%');
  });

  it('shows 0 while muted, regardless of volume', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range ${MEDIA_VOLUME}="0.8" ${MEDIA_MUTED}></media-volume-range>`
    );
    expect(el.range.valueAsNumber).to.equal(0);
    expect(el.range.getAttribute('aria-valuetext')).to.equal('0%');
  });

  it('restores the volume when unmuted', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range ${MEDIA_VOLUME}="0.8" ${MEDIA_MUTED}></media-volume-range>`
    );
    el.mediaMuted = false;
    expect(el.hasAttribute(MEDIA_MUTED)).to.be.false;
    expect(el.range.valueAsNumber).to.equal(0.8);
    expect(el.range.getAttribute('aria-valuetext')).to.equal('80%');
  });

  it('reflects the mediaVolume and mediaMuted properties to attributes', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range></media-volume-range>`
    );
    el.mediaVolume = 0.25;
    expect(el.getAttribute(MEDIA_VOLUME)).to.equal('0.25');
    expect(el.range.valueAsNumber).to.equal(0.25);

    el.mediaMuted = true;
    expect(el.hasAttribute(MEDIA_MUTED)).to.be.true;
    expect(el.range.valueAsNumber).to.equal(0);
  });

  it('requests a volume change on range input', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range></media-volume-range>`
    );
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_VOLUME_REQUEST, handler);
    input(el, '0.3');
    expect(handler.calledOnce).to.be.true;
    const evt = handler.firstCall.args[0] as CustomEvent;
    // The detail is the raw range input value (a string).
    expect(+evt.detail).to.equal(0.3);
    expect(evt.bubbles).to.be.true;
    expect(evt.composed).to.be.true;
  });

  it('stops requesting volume changes once disconnected', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range></media-volume-range>`
    );
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_VOLUME_REQUEST, handler);
    el.remove();
    input(el, '0.3');
    expect(handler.called).to.be.false;
  });

  it('disables the range input when disabled', async () => {
    const el = await fixture<MediaVolumeRange>(
      `<media-volume-range disabled></media-volume-range>`
    );
    expect(el.range.hasAttribute('disabled')).to.be.true;
    el.removeAttribute('disabled');
    expect(el.range.hasAttribute('disabled')).to.be.false;
  });

  describe('mediavolumeunavailable', () => {
    it('reads the unavailability state from the attribute', async () => {
      const el = await fixture<MediaVolumeRange>(
        `<media-volume-range ${MEDIA_VOLUME_UNAVAILABLE}="unsupported"></media-volume-range>`
      );
      expect(el.mediaVolumeUnavailable).to.equal('unsupported');
    });

    it('reflects the property to the attribute', async () => {
      const el = await fixture<MediaVolumeRange>(
        `<media-volume-range></media-volume-range>`
      );
      el.mediaVolumeUnavailable = 'unsupported';
      expect(el.getAttribute(MEDIA_VOLUME_UNAVAILABLE)).to.equal('unsupported');
      el.mediaVolumeUnavailable = undefined;
      expect(el.hasAttribute(MEDIA_VOLUME_UNAVAILABLE)).to.be.false;
    });
  });
});
