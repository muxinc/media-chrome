import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-live-button.js';
import MediaLiveButton from '../../src/js/media-live-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_TIME_IS_LIVE, MEDIA_PAUSED } = MediaUIAttributes;
const { MEDIA_SEEK_TO_LIVE_REQUEST, MEDIA_PLAY_REQUEST } = MediaUIEvents;

const listen = (el: HTMLElement) => {
  const seek = spy();
  const play = spy();
  el.addEventListener(MEDIA_SEEK_TO_LIVE_REQUEST, seek);
  el.addEventListener(MEDIA_PLAY_REQUEST, play);
  return { seek, play };
};

describe('<media-live-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaLiveButton>(
      `<media-live-button></media-live-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it('renders the default indicator, spacer and text slots', async () => {
    const el = await fixture<MediaLiveButton>(
      `<media-live-button></media-live-button>`
    );
    expect(el.shadowRoot.querySelector('slot[name="indicator"] > svg')).to
      .exist;
    expect(el.shadowRoot.querySelector('slot[name="spacer"]')).to.exist;
    expect(
      el.shadowRoot.querySelector('slot[name="text"]').textContent
    ).to.equal(t('live'));
  });

  describe('behind live, playing (not live, not paused)', () => {
    let el: MediaLiveButton;

    beforeEach(async () => {
      el = await fixture<MediaLiveButton>(
        `<media-live-button></media-live-button>`
      );
    });

    it('offers to seek to live and is enabled', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('seek to live'));
      expect(el.hasAttribute('aria-disabled')).to.be.false;
      expect(el.mediaTimeIsLive).to.be.false;
      expect(el.mediaPaused).to.be.false;
    });

    it('requests seek to live only when clicked', () => {
      const { seek, play } = listen(el);
      el.click();
      expect(seek.calledOnce).to.be.true;
      expect(play.called).to.be.false;
      const evt = seek.firstCall.args[0] as CustomEvent;
      expect(evt.bubbles).to.be.true;
      expect(evt.composed).to.be.true;
    });
  });

  describe('live and playing', () => {
    let el: MediaLiveButton;

    beforeEach(async () => {
      el = await fixture<MediaLiveButton>(
        `<media-live-button ${MEDIA_TIME_IS_LIVE}></media-live-button>`
      );
    });

    it('is labelled as playing live and aria-disabled', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('playing live'));
      expect(el.getAttribute('aria-disabled')).to.equal('true');
    });

    it('does not dispatch any request when clicked', () => {
      const { seek, play } = listen(el);
      el.click();
      expect(seek.called).to.be.false;
      expect(play.called).to.be.false;
    });

    it('uses the live indicator color', () => {
      const indicator = el.shadowRoot.querySelector(
        'slot[name="indicator"] > svg'
      );
      expect(getComputedStyle(indicator).fill).to.equal('rgb(255, 0, 0)');
    });
  });

  describe('live but paused', () => {
    let el: MediaLiveButton;

    beforeEach(async () => {
      el = await fixture<MediaLiveButton>(
        `<media-live-button ${MEDIA_TIME_IS_LIVE} ${MEDIA_PAUSED}></media-live-button>`
      );
    });

    it('offers to seek to live and is enabled', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('seek to live'));
      expect(el.hasAttribute('aria-disabled')).to.be.false;
    });

    it('requests seek to live and play when clicked', () => {
      const { seek, play } = listen(el);
      el.click();
      expect(seek.calledOnce).to.be.true;
      expect(play.calledOnce).to.be.true;
      expect(seek.calledBefore(play)).to.be.true;
    });

    it('uses the non-live indicator color', () => {
      const indicator = el.shadowRoot.querySelector(
        'slot[name="indicator"] > svg'
      );
      expect(getComputedStyle(indicator).fill).to.equal('rgb(140, 140, 140)');
    });
  });

  it('requests seek to live and play when paused behind live', async () => {
    const el = await fixture<MediaLiveButton>(
      `<media-live-button ${MEDIA_PAUSED}></media-live-button>`
    );
    const { seek, play } = listen(el);
    el.click();
    expect(seek.calledOnce).to.be.true;
    expect(play.calledOnce).to.be.true;
  });

  it('updates label and aria-disabled as state changes', async () => {
    const el = await fixture<MediaLiveButton>(
      `<media-live-button></media-live-button>`
    );
    el.mediaTimeIsLive = true;
    expect(el.hasAttribute(MEDIA_TIME_IS_LIVE)).to.be.true;
    expect(el.getAttribute('aria-label')).to.equal(t('playing live'));
    expect(el.getAttribute('aria-disabled')).to.equal('true');

    el.mediaPaused = true;
    expect(el.hasAttribute(MEDIA_PAUSED)).to.be.true;
    expect(el.getAttribute('aria-label')).to.equal(t('seek to live'));
    expect(el.hasAttribute('aria-disabled')).to.be.false;

    el.mediaPaused = false;
    el.mediaTimeIsLive = false;
    expect(el.hasAttribute(MEDIA_PAUSED)).to.be.false;
    expect(el.hasAttribute(MEDIA_TIME_IS_LIVE)).to.be.false;
    expect(el.getAttribute('aria-label')).to.equal(t('seek to live'));
  });

  it('supports custom slotted text', async () => {
    const el = await fixture<MediaLiveButton>(
      `<media-live-button><span slot="text" id="custom">Go live</span></media-live-button>`
    );
    const slot = el.shadowRoot.querySelector(
      'slot[name="text"]'
    ) as HTMLSlotElement;
    expect(slot.assignedElements()[0]).to.have.id('custom');
  });
});
