import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-mute-button.js';
import MediaMuteButton from '../../src/js/media-mute-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_VOLUME_LEVEL } = MediaUIAttributes;

const isShown = (el: HTMLElement, selector: string) =>
  getComputedStyle(el.shadowRoot.querySelector(selector)).display !== 'none';

const pressKey = (el: HTMLElement, key: string) => {
  el.dispatchEvent(new KeyboardEvent('keydown', { key }));
  el.dispatchEvent(new KeyboardEvent('keyup', { key }));
};

describe('<media-mute-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaMuteButton>(
      `<media-mute-button></media-mute-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it('has role button and is focusable', async () => {
    const el = await fixture<MediaMuteButton>(
      `<media-mute-button></media-mute-button>`
    );
    expect(el.getAttribute('role')).to.equal('button');
    expect(el.tabIndex).to.equal(0);
  });

  describe('unmuted (no volume level)', () => {
    let el: MediaMuteButton;

    beforeEach(async () => {
      el = await fixture<MediaMuteButton>(
        `<media-mute-button></media-mute-button>`
      );
    });

    it('has the mute label', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('mute'));
      expect(el.mediaVolumeLevel).to.equal(null);
    });

    it('shows the high icon only', () => {
      expect(isShown(el, 'slot[name="high"]')).to.be.true;
      expect(isShown(el, 'slot[name="off"]')).to.be.false;
      expect(isShown(el, 'slot[name="low"]')).to.be.false;
      expect(isShown(el, 'slot[name="medium"]')).to.be.false;
    });

    it('shows the mute tooltip', () => {
      expect(isShown(el, 'slot[name="tooltip-mute"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-unmute"]')).to.be.false;
    });

    it('requests mute when clicked', () => {
      const mute = spy();
      const unmute = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, mute);
      el.addEventListener(MediaUIEvents.MEDIA_UNMUTE_REQUEST, unmute);
      el.click();
      expect(mute.calledOnce).to.be.true;
      expect(unmute.called).to.be.false;
    });

    it('dispatches a bubbling, composed request event', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, handler);
      el.click();
      const evt = handler.firstCall.args[0] as CustomEvent;
      expect(evt.bubbles).to.be.true;
      expect(evt.composed).to.be.true;
    });

    it('requests mute on Enter and Space key presses', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, handler);
      pressKey(el, 'Enter');
      pressKey(el, ' ');
      expect(handler.callCount).to.equal(2);
    });

    it('ignores other keys and modified key presses', () => {
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, handler);
      pressKey(el, 'a');
      el.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', metaKey: true })
      );
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(handler.called).to.be.false;
    });
  });

  describe('volume levels', () => {
    ['low', 'medium', 'high'].forEach((level) => {
      it(`shows only the ${level} icon and the mute label for "${level}"`, async () => {
        const el = await fixture<MediaMuteButton>(
          `<media-mute-button ${MEDIA_VOLUME_LEVEL}="${level}"></media-mute-button>`
        );
        expect(el.getAttribute('aria-label')).to.equal(t('mute'));
        ['off', 'low', 'medium', 'high'].forEach((name) => {
          expect(isShown(el, `slot[name="${name}"]`)).to.equal(name === level);
        });
      });
    });
  });

  describe('muted (volume level off)', () => {
    let el: MediaMuteButton;

    beforeEach(async () => {
      el = await fixture<MediaMuteButton>(
        `<media-mute-button ${MEDIA_VOLUME_LEVEL}="off"></media-mute-button>`
      );
    });

    it('has the unmute label', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('unmute'));
      expect(el.mediaVolumeLevel).to.equal('off');
    });

    it('shows the off icon only', () => {
      expect(isShown(el, 'slot[name="off"]')).to.be.true;
      expect(isShown(el, 'slot[name="high"]')).to.be.false;
    });

    it('shows the unmute tooltip', () => {
      expect(isShown(el, 'slot[name="tooltip-unmute"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-mute"]')).to.be.false;
    });

    it('requests unmute when clicked', () => {
      const mute = spy();
      const unmute = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, mute);
      el.addEventListener(MediaUIEvents.MEDIA_UNMUTE_REQUEST, unmute);
      el.click();
      expect(unmute.calledOnce).to.be.true;
      expect(mute.called).to.be.false;
    });
  });

  it('updates the label when the volume level changes', async () => {
    const el = await fixture<MediaMuteButton>(
      `<media-mute-button></media-mute-button>`
    );
    el.setAttribute(MEDIA_VOLUME_LEVEL, 'off');
    expect(el.getAttribute('aria-label')).to.equal(t('unmute'));
    el.setAttribute(MEDIA_VOLUME_LEVEL, 'low');
    expect(el.getAttribute('aria-label')).to.equal(t('mute'));
  });

  it('reflects the mediaVolumeLevel property to the attribute', async () => {
    const el = await fixture<MediaMuteButton>(
      `<media-mute-button></media-mute-button>`
    );
    el.mediaVolumeLevel = 'off';
    expect(el.getAttribute(MEDIA_VOLUME_LEVEL)).to.equal('off');
    expect(el.getAttribute('aria-label')).to.equal(t('unmute'));
    el.mediaVolumeLevel = undefined;
    expect(el.hasAttribute(MEDIA_VOLUME_LEVEL)).to.be.false;
    expect(el.getAttribute('aria-label')).to.equal(t('mute'));
  });

  describe('disabled', () => {
    it('is not focusable and ignores key presses when initially disabled', async () => {
      const el = await fixture<MediaMuteButton>(
        `<media-mute-button disabled></media-mute-button>`
      );
      expect(el.tabIndex).to.equal(-1);
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, handler);
      pressKey(el, 'Enter');
      expect(handler.called).to.be.false;
    });

    it('does not dispatch requests after being disabled', async () => {
      const el = await fixture<MediaMuteButton>(
        `<media-mute-button></media-mute-button>`
      );
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, handler);
      el.disabled = true;
      expect(el.tabIndex).to.equal(-1);
      el.click();
      pressKey(el, 'Enter');
      expect(handler.called).to.be.false;
    });

    it('dispatches requests again once re-enabled', async () => {
      const el = await fixture<MediaMuteButton>(
        `<media-mute-button disabled></media-mute-button>`
      );
      const handler = spy();
      el.addEventListener(MediaUIEvents.MEDIA_MUTE_REQUEST, handler);
      el.disabled = false;
      expect(el.tabIndex).to.equal(0);
      el.click();
      expect(handler.calledOnce).to.be.true;
    });
  });

  it('supports custom slotted icons', async () => {
    const el = await fixture<MediaMuteButton>(
      `<media-mute-button><span slot="off" id="custom-off">Off</span></media-mute-button>`
    );
    const slot = el.shadowRoot.querySelector(
      'slot[name="off"]'
    ) as HTMLSlotElement;
    expect(slot.assignedElements()[0]).to.have.id('custom-off');
  });
});
