import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-fullscreen-button.js';
import MediaFullscreenButton from '../../src/js/media-fullscreen-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_IS_FULLSCREEN, MEDIA_FULLSCREEN_UNAVAILABLE } = MediaUIAttributes;
const { MEDIA_ENTER_FULLSCREEN_REQUEST, MEDIA_EXIT_FULLSCREEN_REQUEST } =
  MediaUIEvents;

const isShown = (el: HTMLElement, selector: string) =>
  getComputedStyle(el.shadowRoot.querySelector(selector)).display !== 'none';

const listen = (el: HTMLElement) => {
  const enter = spy();
  const exit = spy();
  el.addEventListener(MEDIA_ENTER_FULLSCREEN_REQUEST, enter);
  el.addEventListener(MEDIA_EXIT_FULLSCREEN_REQUEST, exit);
  return { enter, exit };
};

describe('<media-fullscreen-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaFullscreenButton>(
      `<media-fullscreen-button></media-fullscreen-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('not fullscreen', () => {
    let el: MediaFullscreenButton;

    beforeEach(async () => {
      el = await fixture<MediaFullscreenButton>(
        `<media-fullscreen-button></media-fullscreen-button>`
      );
    });

    it('has the enter fullscreen label', () => {
      expect(el.getAttribute('aria-label')).to.equal(
        t('enter fullscreen mode')
      );
      expect(el.mediaIsFullscreen).to.be.false;
    });

    it('shows the enter icon and tooltip', () => {
      expect(isShown(el, 'slot[name="enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="exit"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.false;
    });

    it('requests enter fullscreen with detail true for pointer clicks', () => {
      const { enter, exit } = listen(el);
      el.dispatchEvent(new PointerEvent('click', { bubbles: true }));
      expect(enter.calledOnce).to.be.true;
      expect(exit.called).to.be.false;
      const evt = enter.firstCall.args[0] as CustomEvent;
      expect(evt.detail).to.equal(true);
      expect(evt.bubbles).to.be.true;
      expect(evt.composed).to.be.true;
    });

    it('requests enter fullscreen with detail false for non-pointer clicks', () => {
      const { enter } = listen(el);
      el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(enter.calledOnce).to.be.true;
      expect(enter.firstCall.args[0].detail).to.equal(false);
    });

    it('requests enter fullscreen with detail false for keyboard activation', () => {
      const { enter } = listen(el);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(enter.calledOnce).to.be.true;
      expect(enter.firstCall.args[0].detail).to.equal(false);
    });
  });

  describe('fullscreen', () => {
    let el: MediaFullscreenButton;

    beforeEach(async () => {
      el = await fixture<MediaFullscreenButton>(
        `<media-fullscreen-button ${MEDIA_IS_FULLSCREEN}></media-fullscreen-button>`
      );
    });

    it('has the exit fullscreen label', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('exit fullscreen mode'));
      expect(el.mediaIsFullscreen).to.be.true;
    });

    it('shows the exit icon and tooltip', () => {
      expect(isShown(el, 'slot[name="exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="enter"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.false;
    });

    it('requests exit fullscreen when clicked', () => {
      const { enter, exit } = listen(el);
      el.click();
      expect(exit.calledOnce).to.be.true;
      expect(enter.called).to.be.false;
      expect(exit.firstCall.args[0].detail).to.equal(null);
    });
  });

  it('updates the label when the fullscreen state changes', async () => {
    const el = await fixture<MediaFullscreenButton>(
      `<media-fullscreen-button></media-fullscreen-button>`
    );
    el.mediaIsFullscreen = true;
    expect(el.hasAttribute(MEDIA_IS_FULLSCREEN)).to.be.true;
    expect(el.getAttribute('aria-label')).to.equal(t('exit fullscreen mode'));
    el.mediaIsFullscreen = false;
    expect(el.hasAttribute(MEDIA_IS_FULLSCREEN)).to.be.false;
    expect(el.getAttribute('aria-label')).to.equal(t('enter fullscreen mode'));
  });

  describe('mediafullscreenunavailable', () => {
    it('reads the unavailability state from the attribute', async () => {
      const el = await fixture<MediaFullscreenButton>(
        `<media-fullscreen-button ${MEDIA_FULLSCREEN_UNAVAILABLE}="unsupported"></media-fullscreen-button>`
      );
      expect(el.mediaFullscreenUnavailable).to.equal('unsupported');
    });

    it('reflects the property to the attribute', async () => {
      const el = await fixture<MediaFullscreenButton>(
        `<media-fullscreen-button></media-fullscreen-button>`
      );
      expect(el.mediaFullscreenUnavailable).to.equal(null);
      el.mediaFullscreenUnavailable = 'unavailable';
      expect(el.getAttribute(MEDIA_FULLSCREEN_UNAVAILABLE)).to.equal(
        'unavailable'
      );
      el.mediaFullscreenUnavailable = undefined;
      expect(el.hasAttribute(MEDIA_FULLSCREEN_UNAVAILABLE)).to.be.false;
    });
  });

  it('does not dispatch requests after being disabled', async () => {
    const el = await fixture<MediaFullscreenButton>(
      `<media-fullscreen-button></media-fullscreen-button>`
    );
    const { enter } = listen(el);
    el.disabled = true;
    el.click();
    expect(enter.called).to.be.false;
  });
});
