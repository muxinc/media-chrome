import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-live-button.js';
import MediaLiveButton from '../../src/js/media-live-button.js';
import { t } from '../../src/js/utils/i18n.js';

describe('<media-live-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaLiveButton>(
      `<media-live-button></media-live-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('default state', () => {
    let el: MediaLiveButton;

    beforeEach(async () => {
      el = await fixture(`<media-live-button></media-live-button>`);
    });

    it('should have aria-label "seek to live"', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('seek to live'));
    });

    it('should show the indicator slot', () => {
      const icon = el.shadowRoot?.querySelector('slot[name="indicator"] > *');
      expect(icon).to.exist;
    });

    it('should dispatch MEDIA_SEEK_TO_LIVE_REQUEST on click', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_SEEK_TO_LIVE_REQUEST, handler);
      el.click();
      expect(handler.calledOnce).to.be.true;
    });

    it('should not dispatch MEDIA_PLAY_REQUEST if not paused', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_PLAY_REQUEST, handler);
      el.click();
      expect(handler.called).to.be.false;
    });
  });

  describe('when paused', () => {
    let el: MediaLiveButton;

    beforeEach(async () => {
      el = await fixture(
        `<media-live-button ${MediaUIAttributes.MEDIA_PAUSED}></media-live-button>`
      );
    });

    it('should have aria-label "seek to live"', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('seek to live'));
    });

    it('should dispatch MEDIA_SEEK_TO_LIVE_REQUEST and MEDIA_PLAY_REQUEST when clicked', () => {
      const seekHandler = spy();
      const playHandler = spy();

      el.addEventListener(MediaUIEvents.MEDIA_SEEK_TO_LIVE_REQUEST, seekHandler);
      el.addEventListener(MediaUIEvents.MEDIA_PLAY_REQUEST, playHandler);

      el.click();

      expect(seekHandler.calledOnce).to.be.true;
      expect(playHandler.calledOnce).to.be.true;
    });
  });

  describe('when live and playing', () => {
    let el: MediaLiveButton;

    beforeEach(async () => {
      el = await fixture(
        `<media-live-button 
          ${MediaUIAttributes.MEDIA_TIME_IS_LIVE}
          ></media-live-button>`
      );
    });

    it('should have aria-label "playing live"', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('playing live'));
    });

    it('should have aria-disabled="true"', () => {
      expect(el.getAttribute('aria-disabled')).to.equal('true');
    });

    it('should not dispatch any events on click', () => {
      const seekHandler = spy();
      const playHandler = spy();

      el.addEventListener(MediaUIEvents.MEDIA_SEEK_TO_LIVE_REQUEST, seekHandler);
      el.addEventListener(MediaUIEvents.MEDIA_PLAY_REQUEST, playHandler);

      el.click();

      expect(seekHandler.called).to.be.false;
      expect(playHandler.called).to.be.false;
    });
  });

  describe.skip('custom slots', () => {
    it('should support custom indicator slot', async () => {
      const idStr = 'customIndicator';
      const slotStr = 'indicator';
      const el = await fixture<MediaLiveButton>(
        `<media-live-button><span id="${idStr}" slot="${slotStr}">•</span></media-live-button>`
      );
      const slottedEl = el?.shadowRoot?.querySelector(
        `slot[name="${slotStr}"] > *`
      );
      expect(slottedEl).to.have.id(idStr);
    });

    it('should support custom text slot', async () => {
      const idStr = 'customText';
      const slotStr = 'text';
      const el = await fixture<MediaLiveButton>(
        `<media-live-button><span id="${idStr}" slot="${slotStr}">LIVE NOW</span></media-live-button>`
      );
      const slottedEl = el?.shadowRoot?.querySelector(
        `slot[name="${slotStr}"] > *`
      );
      expect(slottedEl).to.have.id(idStr);
    });
  });
});
