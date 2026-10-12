import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-captions-button.js';
import MediaCaptionsButton from '../../src/js/media-captions-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_SUBTITLES_LIST, MEDIA_SUBTITLES_SHOWING } = MediaUIAttributes;

const isShown = (el: HTMLElement, selector: string) =>
  getComputedStyle(el.shadowRoot.querySelector(selector)).display !== 'none';

const english = { kind: 'subtitles', language: 'en', label: 'English' };
const frenchCC = { kind: 'captions', language: 'fr', label: 'Français' };

describe('<media-captions-button>', () => {
  describe('captions off', () => {
    let el: MediaCaptionsButton;

    beforeEach(async () => {
      el = await fixture<MediaCaptionsButton>(
        `<media-captions-button></media-captions-button>`
      );
    });

    it('has the closed captions label and button role', () => {
      expect(el.getAttribute('aria-label')).to.equal(t('closed captions'));
      expect(el.getAttribute('role')).to.equal('button');
    });

    it('is not checked', () => {
      expect(el.getAttribute('aria-checked')).to.equal('false');
    });

    it('shows the off icon and enable tooltip', () => {
      expect(isShown(el, 'slot[name="off"]')).to.be.true;
      expect(isShown(el, 'slot[name="on"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-enable"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-disable"]')).to.be.false;
    });

    it('has empty subtitle lists', () => {
      expect(el.mediaSubtitlesList).to.deep.equal([]);
      expect(el.mediaSubtitlesShowing).to.deep.equal([]);
    });

    it('requests toggling subtitles when clicked', () => {
      const handler = spy();
      el.addEventListener(
        MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST,
        handler
      );
      el.click();
      expect(handler.calledOnce).to.be.true;
      const evt = handler.firstCall.args[0] as CustomEvent;
      expect(evt.bubbles).to.be.true;
      expect(evt.composed).to.be.true;
    });
  });

  describe('captions on', () => {
    let el: MediaCaptionsButton;

    beforeEach(async () => {
      el = await fixture<MediaCaptionsButton>(
        `<media-captions-button ${MEDIA_SUBTITLES_SHOWING}="sb:en:English"></media-captions-button>`
      );
    });

    it('is checked', () => {
      expect(el.getAttribute('aria-checked')).to.equal('true');
    });

    it('shows the on icon and disable tooltip', () => {
      expect(isShown(el, 'slot[name="on"]')).to.be.true;
      expect(isShown(el, 'slot[name="off"]')).to.be.false;
      expect(isShown(el, 'slot[name="tooltip-disable"]')).to.be.true;
      expect(isShown(el, 'slot[name="tooltip-enable"]')).to.be.false;
    });

    it('parses the showing subtitles attribute', () => {
      expect(el.mediaSubtitlesShowing).to.deep.equal([english]);
    });

    it('requests toggling subtitles when clicked', () => {
      const handler = spy();
      el.addEventListener(
        MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST,
        handler
      );
      el.click();
      expect(handler.calledOnce).to.be.true;
    });

    it('becomes unchecked when the showing attribute is removed', () => {
      el.removeAttribute(MEDIA_SUBTITLES_SHOWING);
      expect(el.getAttribute('aria-checked')).to.equal('false');
    });
  });

  it('parses the subtitles list attribute', async () => {
    const el = await fixture<MediaCaptionsButton>(
      `<media-captions-button ${MEDIA_SUBTITLES_LIST}="sb:en:English cc:fr:Fran%C3%A7ais"></media-captions-button>`
    );
    expect(el.mediaSubtitlesList).to.deep.equal([english, frenchCC]);
    // The list alone does not mean subtitles are showing.
    expect(el.getAttribute('aria-checked')).to.equal('false');
  });

  it('serializes the subtitles list property to the attribute', async () => {
    const el = await fixture<MediaCaptionsButton>(
      `<media-captions-button></media-captions-button>`
    );
    el.mediaSubtitlesList = [english, frenchCC];
    expect(el.getAttribute(MEDIA_SUBTITLES_LIST)).to.equal(
      'sb:en:English cc:fr:Fran%C3%A7ais'
    );
    el.mediaSubtitlesList = [];
    expect(el.hasAttribute(MEDIA_SUBTITLES_LIST)).to.be.false;
  });

  it('serializes the showing subtitles property and updates aria-checked', async () => {
    const el = await fixture<MediaCaptionsButton>(
      `<media-captions-button></media-captions-button>`
    );
    el.mediaSubtitlesShowing = [english];
    expect(el.getAttribute(MEDIA_SUBTITLES_SHOWING)).to.equal('sb:en:English');
    expect(el.getAttribute('aria-checked')).to.equal('true');

    el.mediaSubtitlesShowing = null;
    expect(el.hasAttribute(MEDIA_SUBTITLES_SHOWING)).to.be.false;
    expect(el.getAttribute('aria-checked')).to.equal('false');
  });

  it('does not re-set the attribute when the value is unchanged', async () => {
    const el = await fixture<MediaCaptionsButton>(
      `<media-captions-button ${MEDIA_SUBTITLES_SHOWING}="sb:en:English"></media-captions-button>`
    );
    const setAttributeSpy = spy(el, 'setAttribute');
    el.mediaSubtitlesShowing = [english];
    expect(setAttributeSpy.calledWith(MEDIA_SUBTITLES_SHOWING)).to.be.false;
    setAttributeSpy.restore();
  });

  it('does not dispatch requests after being disabled', async () => {
    const el = await fixture<MediaCaptionsButton>(
      `<media-captions-button></media-captions-button>`
    );
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST, handler);
    el.disabled = true;
    el.click();
    expect(handler.called).to.be.false;
  });
});
