import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-airplay-button.js';
import MediaAirplayButton from '../../src/js/media-airplay-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_IS_AIRPLAYING, MEDIA_AIRPLAY_UNAVAILABLE } = MediaUIAttributes;

const isShown = (el: HTMLElement, selector: string) =>
  getComputedStyle(el.shadowRoot.querySelector(selector)).display !== 'none';

describe('<media-airplay-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaAirplayButton>(
      `<media-airplay-button></media-airplay-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('not airplaying', () => {
    let el: MediaAirplayButton;

    beforeEach(async () => {
      el = await fixture<MediaAirplayButton>(
        `<media-airplay-button></media-airplay-button>`
      );
    });

    it('has the start airplay label', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('start airplay'));
      expect(el.mediaIsAirplaying).to.be.false;
    });

    it('shows the enter icon and tooltip', () => {
      expect(isShown(el, 'slot[name="enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="exit"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.false;
    });

    it('requests airplay when clicked', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_AIRPLAY_REQUEST, handler);
      el.click();
      expect(handler.calledOnce).to.be.true;
      const evt = handler.firstCall.args[0] as CustomEvent;
      expect(evt.bubbles).to.be.true;
      expect(evt.composed).to.be.true;
    });
  });

  describe('airplaying', () => {
    let el: MediaAirplayButton;

    beforeEach(async () => {
      el = await fixture<MediaAirplayButton>(
        `<media-airplay-button ${MEDIA_IS_AIRPLAYING}></media-airplay-button>`
      );
    });

    it('has the stop airplay label', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('stop airplay'));
      expect(el.mediaIsAirplaying).to.be.true;
    });

    it('shows the exit icon and tooltip', () => {
      expect(isShown(el, 'slot[name="exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="enter"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.false;
    });

    it('still requests airplay (opens the picker) when clicked', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_AIRPLAY_REQUEST, handler);
      el.click();
      expect(handler.calledOnce).to.be.true;
    });
  });

  it('updates the label when the airplay state changes', async () => {
    const el = await fixture<MediaAirplayButton>(
      `<media-airplay-button></media-airplay-button>`
    );
    el.mediaIsAirplaying = true;
    expect(el.hasAttribute(MEDIA_IS_AIRPLAYING)).to.be.true;
    expect(el.getAttribute('aria-label')).to.equal(t('stop airplay'));
    el.mediaIsAirplaying = false;
    expect(el.hasAttribute(MEDIA_IS_AIRPLAYING)).to.be.false;
    expect(el.getAttribute('aria-label')).to.equal(t('start airplay'));
  });

  describe('mediaairplayunavailable', () => {
    it('reads the unavailability state from the attribute', async () => {
      const el = await fixture<MediaAirplayButton>(
        `<media-airplay-button ${MEDIA_AIRPLAY_UNAVAILABLE}="unsupported"></media-airplay-button>`
      );
      expect(el.mediaAirplayUnavailable).to.equal('unsupported');
      expect(el.getAttribute('aria-label')).to.equal(t('start airplay'));
    });

    it('reflects the property to the attribute', async () => {
      const el = await fixture<MediaAirplayButton>(
        `<media-airplay-button></media-airplay-button>`
      );
      expect(el.mediaAirplayUnavailable).to.equal(null);
      el.mediaAirplayUnavailable = 'unavailable';
      expect(el.getAttribute(MEDIA_AIRPLAY_UNAVAILABLE)).to.equal(
        'unavailable'
      );
      el.mediaAirplayUnavailable = undefined;
      expect(el.hasAttribute(MEDIA_AIRPLAY_UNAVAILABLE)).to.be.false;
    });
  });

  it('does not dispatch requests after being disabled', async () => {
    const el = await fixture<MediaAirplayButton>(
      `<media-airplay-button></media-airplay-button>`
    );
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_AIRPLAY_REQUEST, handler);
    el.disabled = true;
    el.click();
    expect(handler.called).to.be.false;
  });
});
