import { spy } from 'sinon';
import { fixture, expect } from '@open-wc/testing';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants';
import { verbs } from '../../src/js/labels/labels';
import '../../src/js/media-play-button';

describe('<media-play-button/>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture(`<media-play-button></media-play-button>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('default/playing', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(`<media-play-button></media-play-button>`);
    });

    afterEach(() => {
      el = undefined;
    });

    it('should expect pause actions', async () => {
      expect(el.getAttribute('aria-label')).equals(verbs.PAUSE());
    });

    it('should show pause', () => {
      const icon = el.shadowRoot.querySelector('slot[name="pause"] > *');
      expect(icon).to.be.visible;
    });

    /** @TODO Figure out if this test failure is due to assertion assumptions of visible vs. invalid component initialization condition (CJP) */
    it.skip('should not show play', () => {
      const icon = el.shadowRoot.querySelector('slot[name="play"] > *');
      expect(icon).to.not.be.visible;
    });

    it('should request pause when clicked', () => {
      const requestHandler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_PAUSE_REQUEST, requestHandler);
      el.click();
      expect(requestHandler.calledOnce).to.be.true;
    });

    it('should not request play when clicked', () => {
      const requestHandler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_PLAY_REQUEST, requestHandler);
      el.click();
      expect(requestHandler.called).to.be.false;
    });

    it.skip('should request pause when Enter pressed', () => {
      /** @TODO Implement me (CJP) */
      expect(false).to.be.true;
    });

    it.skip('should request pause when Space pressed', () => {
      /** @TODO Implement me (CJP) */
      expect(false).to.be.true;
    });
  });

  describe('paused', () => {
    let el;

    beforeEach(async () => {
      el = await fixture(
        `<media-play-button ${MediaUIAttributes.MEDIA_PAUSED}></media-play-button>`
      );
    });

    afterEach(() => {
      el = undefined;
    });

    it('should expect play actions', async () => {
      expect(el.getAttribute('aria-label')).equals(verbs.PLAY());
    });

    it('should show play', () => {
      const icon = el.shadowRoot.querySelector('slot[name="play"] > *');
      expect(icon).to.be.visible;
    });

    /** @TODO Figure out if this test failure is due to assertion assumptions of visible vs. invalid component initialization condition (CJP) */
    it.skip('should not show pause', () => {
      const icon = el.shadowRoot.querySelector('slot[name="pause"] > *');
      expect(icon).to.not.be.visible;
    });

    it('should request play when clicked', () => {
      const requestHandler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_PLAY_REQUEST, requestHandler);
      el.click();
      expect(requestHandler.calledOnce).to.be.true;
    });

    it('should not request pause when clicked', () => {
      const requestHandler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_PAUSE_REQUEST, requestHandler);
      el.click();
      expect(requestHandler.called).to.be.false;
    });

    it.skip('should request play when Enter pressed', () => {
      /** @TODO Implement me (CJP) */
      expect(false).to.be.true;
    });

    it.skip('should request play when Space pressed', () => {
      /** @TODO Implement me (CJP) */
      expect(false).to.be.true;
    });
  });

  /** @TODO Investigate why slots are still svgs in these cases (CJP) */
  describe.skip('custom slots', () => {
    it('should support custom play content', async () => {
      const idStr = 'customPlay';
      const slotStr = 'play';

      const el = await fixture(
        `<media-play-button><span id="${idStr}" slot="${slotStr}">Play</span></media-play-button>`
      );
      const slottedEl = el.shadowRoot.querySelector(
        `slot[name="${slotStr}"] > *`
      );
      expect(slottedEl).to.have.id(idStr);
    });

    it('should support custom pause content', async () => {
      const idStr = 'customPause';
      const slotStr = 'pause';

      const el = await fixture(
        `<media-play-button><span id="${idStr}" slot="${slotStr}">Play</span></media-play-button>`
      );
      const slottedEl = el.shadowRoot.querySelector(
        `slot[name="${slotStr}"] > *`
      );
      expect(slottedEl).to.have.id(idStr);
    });
  });
});
