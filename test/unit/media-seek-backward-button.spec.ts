import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-seek-backward-button.js';
import MediaSeekBackwardButton, {
  Attributes,
} from '../../src/js/media-seek-backward-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_CURRENT_TIME } = MediaUIAttributes;

const label = (seekOffset: number) =>
  t('seek back {seekOffset} seconds', { seekOffset });

const iconText = (el: HTMLElement) =>
  el.shadowRoot.querySelector('slot[name="icon"] .value').textContent;

const clickAndGetDetail = (el: HTMLElement) => {
  const handler = spy();
  el.addEventListener(MediaUIEvents.MEDIA_SEEK_REQUEST, handler);
  el.click();
  expect(handler.calledOnce).to.be.true;
  return (handler.firstCall.args[0] as CustomEvent).detail;
};

describe('<media-seek-backward-button>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaSeekBackwardButton>(
      `<media-seek-backward-button></media-seek-backward-button>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe('defaults', () => {
    let el: MediaSeekBackwardButton;

    beforeEach(async () => {
      el = await fixture<MediaSeekBackwardButton>(
        `<media-seek-backward-button></media-seek-backward-button>`
      );
    });

    it('uses a 30 second seek offset and reflects it', () => {
      expect(el.seekOffset).to.equal(30);
      expect(el.getAttribute(Attributes.SEEK_OFFSET)).to.equal('30');
    });

    it('labels and renders the seek offset', () => {
      expect(el.getAttribute('aria-label')).to.equal(label(30));
      expect(iconText(el)).to.equal('30');
    });

    it('renders the tooltip', () => {
      const tooltip = el.shadowRoot.querySelector(
        'slot[name="tooltip-content"]'
      );
      expect(tooltip.textContent.trim()).to.equal(t('Seek backward'));
    });

    it('defaults the current time to 0', () => {
      expect(el.mediaCurrentTime).to.equal(0);
    });

    it('clamps the seek request to 0', () => {
      expect(clickAndGetDetail(el)).to.equal(0);
    });
  });

  it('requests a seek of current time minus the offset', async () => {
    const el = await fixture<MediaSeekBackwardButton>(
      `<media-seek-backward-button ${MEDIA_CURRENT_TIME}="100"></media-seek-backward-button>`
    );
    expect(el.mediaCurrentTime).to.equal(100);
    expect(clickAndGetDetail(el)).to.equal(70);
  });

  it('uses a custom seekoffset attribute', async () => {
    const el = await fixture<MediaSeekBackwardButton>(
      `<media-seek-backward-button seekoffset="10" ${MEDIA_CURRENT_TIME}="25.5"></media-seek-backward-button>`
    );
    expect(el.seekOffset).to.equal(10);
    expect(el.getAttribute('aria-label')).to.equal(label(10));
    expect(iconText(el)).to.equal('10');
    expect(clickAndGetDetail(el)).to.equal(15.5);
  });

  it('clamps to 0 when the offset exceeds the current time', async () => {
    const el = await fixture<MediaSeekBackwardButton>(
      `<media-seek-backward-button seekoffset="15" ${MEDIA_CURRENT_TIME}="5"></media-seek-backward-button>`
    );
    expect(clickAndGetDetail(el)).to.equal(0);
  });

  it('updates label and icon when seekoffset changes', async () => {
    const el = await fixture<MediaSeekBackwardButton>(
      `<media-seek-backward-button></media-seek-backward-button>`
    );
    el.setAttribute(Attributes.SEEK_OFFSET, '5');
    expect(el.seekOffset).to.equal(5);
    expect(el.getAttribute('aria-label')).to.equal(label(5));
    expect(iconText(el)).to.equal('5');

    el.seekOffset = 20;
    expect(el.getAttribute(Attributes.SEEK_OFFSET)).to.equal('20');
    expect(el.getAttribute('aria-label')).to.equal(label(20));
    expect(iconText(el)).to.equal('20');
  });

  it('uses the latest current time on click', async () => {
    const el = await fixture<MediaSeekBackwardButton>(
      `<media-seek-backward-button seekoffset="10"></media-seek-backward-button>`
    );
    el.mediaCurrentTime = 42;
    expect(el.getAttribute(MEDIA_CURRENT_TIME)).to.equal('42');
    expect(clickAndGetDetail(el)).to.equal(32);
  });

  it('does not dispatch requests after being disabled', async () => {
    const el = await fixture<MediaSeekBackwardButton>(
      `<media-seek-backward-button></media-seek-backward-button>`
    );
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_SEEK_REQUEST, handler);
    el.disabled = true;
    el.click();
    expect(handler.called).to.be.false;
  });
});
