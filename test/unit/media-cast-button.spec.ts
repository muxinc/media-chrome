import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-cast-button.js';
import MediaCastButton from '../../src/js/media-cast-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_IS_CASTING, MEDIA_CAST_UNAVAILABLE } = MediaUIAttributes;
const { MEDIA_ENTER_CAST_REQUEST, MEDIA_EXIT_CAST_REQUEST } = MediaUIEvents;

const isShown = (el: HTMLElement, selector: string) =>
  getComputedStyle(el.shadowRoot.querySelector(selector)).display !== 'none';

const listen = (el: HTMLElement) => {
  const enter = spy();
  const exit = spy();
  el.addEventListener(MEDIA_ENTER_CAST_REQUEST, enter);
  el.addEventListener(MEDIA_EXIT_CAST_REQUEST, exit);
  return { enter, exit };
};

describe('<media-cast-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaCastButton>(
      `<media-cast-button></media-cast-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('not casting', () => {
    let el: MediaCastButton;

    beforeEach(async () => {
      el = await fixture<MediaCastButton>(
        `<media-cast-button></media-cast-button>`
      );
    });

    it('has the start casting label', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('start casting'));
      expect(el.mediaIsCasting).to.be.false;
    });

    it('shows the enter icon and tooltip', () => {
      expect(isShown(el, 'slot[name="enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="exit"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.false;
      expect(
        el.shadowRoot.querySelector('slot[name="tooltip-enter"]').textContent
      ).to.equal(t('Start casting'));
    });

    it('requests enter cast when clicked', () => {
      const { enter, exit } = listen(el);
      el.click();
      expect(enter.calledOnce).to.be.true;
      expect(exit.called).to.be.false;
      const evt = enter.firstCall.args[0] as CustomEvent;
      expect(evt.bubbles).to.be.true;
      expect(evt.composed).to.be.true;
    });
  });

  describe('casting', () => {
    let el: MediaCastButton;

    beforeEach(async () => {
      el = await fixture<MediaCastButton>(
        `<media-cast-button ${MEDIA_IS_CASTING}></media-cast-button>`
      );
    });

    it('has the stop casting label', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('stop casting'));
      expect(el.mediaIsCasting).to.be.true;
    });

    it('shows the exit icon and tooltip', () => {
      expect(isShown(el, 'slot[name="exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="enter"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.false;
    });

    it('requests exit cast when clicked', () => {
      const { enter, exit } = listen(el);
      el.click();
      expect(exit.calledOnce).to.be.true;
      expect(enter.called).to.be.false;
    });
  });

  it('updates the label when the casting state changes', async () => {
    const el = await fixture<MediaCastButton>(
      `<media-cast-button></media-cast-button>`
    );
    el.mediaIsCasting = true;
    expect(el.hasAttribute(MEDIA_IS_CASTING)).to.be.true;
    expect(el.getAttribute('aria-label')).to.equal(t('stop casting'));
    el.mediaIsCasting = false;
    expect(el.hasAttribute(MEDIA_IS_CASTING)).to.be.false;
    expect(el.getAttribute('aria-label')).to.equal(t('start casting'));
  });

  describe('mediacastunavailable', () => {
    it('reads the unavailability state from the attribute', async () => {
      const el = await fixture<MediaCastButton>(
        `<media-cast-button ${MEDIA_CAST_UNAVAILABLE}="unsupported"></media-cast-button>`
      );
      expect(el.mediaCastUnavailable).to.equal('unsupported');
    });

    it('reflects the property to the attribute', async () => {
      const el = await fixture<MediaCastButton>(
        `<media-cast-button></media-cast-button>`
      );
      expect(el.mediaCastUnavailable).to.equal(null);
      el.mediaCastUnavailable = 'unavailable';
      expect(el.getAttribute(MEDIA_CAST_UNAVAILABLE)).to.equal('unavailable');
      el.mediaCastUnavailable = undefined;
      expect(el.hasAttribute(MEDIA_CAST_UNAVAILABLE)).to.be.false;
    });

    it('does not change the label', async () => {
      const el = await fixture<MediaCastButton>(
        `<media-cast-button ${MEDIA_CAST_UNAVAILABLE}="unavailable"></media-cast-button>`
      );
      expect(el.getAttribute('aria-label')).to.equal(t('start casting'));
    });
  });

  it('does not dispatch requests after being disabled', async () => {
    const el = await fixture<MediaCastButton>(
      `<media-cast-button></media-cast-button>`
    );
    const { enter } = listen(el);
    el.disabled = true;
    el.click();
    expect(enter.called).to.be.false;
  });
});
