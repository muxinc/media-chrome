import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-pip-button.js';
import MediaPipButton from '../../src/js/media-pip-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_IS_PIP, MEDIA_PIP_UNAVAILABLE } = MediaUIAttributes;
const { MEDIA_ENTER_PIP_REQUEST, MEDIA_EXIT_PIP_REQUEST } = MediaUIEvents;

const isShown = (el: HTMLElement, selector: string) =>
  getComputedStyle(el.shadowRoot.querySelector(selector)).display !== 'none';

const listen = (el: HTMLElement) => {
  const enter = spy();
  const exit = spy();
  el.addEventListener(MEDIA_ENTER_PIP_REQUEST, enter);
  el.addEventListener(MEDIA_EXIT_PIP_REQUEST, exit);
  return { enter, exit };
};

describe('<media-pip-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaPipButton>(
      `<media-pip-button></media-pip-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('not in pip', () => {
    let el: MediaPipButton;

    beforeEach(async () => {
      el = await fixture<MediaPipButton>(
        `<media-pip-button></media-pip-button>`
      );
    });

    it('has the enter pip label', () => {
      expect(el.getAttribute('aria-label')).to.equal(
        t('enter picture in picture mode')
      );
      expect(el.mediaIsPip).to.be.false;
    });

    it('shows the enter icon and tooltip', () => {
      expect(isShown(el, 'slot[name="enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="exit"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.false;
    });

    it('requests enter pip when clicked', () => {
      const { enter, exit } = listen(el);
      el.click();
      expect(enter.calledOnce).to.be.true;
      expect(exit.called).to.be.false;
      const evt = enter.firstCall.args[0] as CustomEvent;
      expect(evt.bubbles).to.be.true;
      expect(evt.composed).to.be.true;
    });
  });

  describe('in pip', () => {
    let el: MediaPipButton;

    beforeEach(async () => {
      el = await fixture<MediaPipButton>(
        `<media-pip-button ${MEDIA_IS_PIP}></media-pip-button>`
      );
    });

    it('has the exit pip label', () => {
      expect(el.getAttribute('aria-label')).to.equal(
        t('exit picture in picture mode')
      );
      expect(el.mediaIsPip).to.be.true;
    });

    it('shows the exit icon and tooltip', () => {
      expect(isShown(el, 'slot[name="exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="enter"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-exit"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-enter"]')).to.be.false;
    });

    it('requests exit pip when clicked', () => {
      const { enter, exit } = listen(el);
      el.click();
      expect(exit.calledOnce).to.be.true;
      expect(enter.called).to.be.false;
    });
  });

  it('updates the label when the pip state changes', async () => {
    const el = await fixture<MediaPipButton>(
      `<media-pip-button></media-pip-button>`
    );
    el.mediaIsPip = true;
    expect(el.hasAttribute(MEDIA_IS_PIP)).to.be.true;
    expect(el.getAttribute('aria-label')).to.equal(
      t('exit picture in picture mode')
    );
    el.mediaIsPip = false;
    expect(el.hasAttribute(MEDIA_IS_PIP)).to.be.false;
    expect(el.getAttribute('aria-label')).to.equal(
      t('enter picture in picture mode')
    );
  });

  describe('mediapipunavailable', () => {
    it('reads the unavailability state from the attribute', async () => {
      const el = await fixture<MediaPipButton>(
        `<media-pip-button ${MEDIA_PIP_UNAVAILABLE}="unsupported"></media-pip-button>`
      );
      expect(el.mediaPipUnavailable).to.equal('unsupported');
    });

    it('reflects the property to the attribute', async () => {
      const el = await fixture<MediaPipButton>(
        `<media-pip-button></media-pip-button>`
      );
      expect(el.mediaPipUnavailable).to.equal(null);
      el.mediaPipUnavailable = 'unavailable';
      expect(el.getAttribute(MEDIA_PIP_UNAVAILABLE)).to.equal('unavailable');
      el.mediaPipUnavailable = undefined;
      expect(el.hasAttribute(MEDIA_PIP_UNAVAILABLE)).to.be.false;
    });
  });

  it('does not dispatch requests after being disabled', async () => {
    const el = await fixture<MediaPipButton>(
      `<media-pip-button></media-pip-button>`
    );
    const { enter } = listen(el);
    el.disabled = true;
    el.click();
    expect(enter.called).to.be.false;
  });
});
