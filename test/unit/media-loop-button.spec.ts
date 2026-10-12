import { expect, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaUIAttributes, MediaUIEvents } from '../../src/js/constants.js';

import '../../src/js/media-loop-button.js';
import MediaLoopButton from '../../src/js/media-loop-button.js';
import { t } from '../../src/js/utils/i18n.js';

const { MEDIA_LOOP } = MediaUIAttributes;

describe('<media-loop-button>', () => {
  let el: MediaLoopButton;

  beforeEach(async () => {
    el = await fixture<MediaLoopButton>(
      `<media-loop-button></media-loop-button>`
    );
  });

  it('renders the Loop label in the icon container', () => {
    expect(el.container).to.equal(el.shadowRoot.querySelector('#icon'));
    expect(el.container.textContent).to.equal(t('Loop'));
  });

  it('renders the Loop tooltip', () => {
    const tooltip = el.shadowRoot.querySelector('slot[name="tooltip-content"]');
    expect(tooltip.textContent.trim()).to.equal(t('Loop'));
  });

  it('is not looping by default', () => {
    expect(el.mediaLoop).to.be.false;
    const indicator = el.shadowRoot.querySelector('#checked-indicator');
    expect(getComputedStyle(indicator).display).to.equal('none');
  });

  it('requests loop enabled when clicked while not looping', () => {
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_LOOP_REQUEST, handler);
    el.click();
    expect(handler.calledOnce).to.be.true;
    const evt = handler.firstCall.args[0] as CustomEvent;
    expect(evt.detail).to.equal(true);
    expect(evt.bubbles).to.be.true;
    expect(evt.composed).to.be.true;
  });

  it('requests loop disabled when clicked while looping', () => {
    el.setAttribute(MEDIA_LOOP, '');
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_LOOP_REQUEST, handler);
    el.click();
    expect(handler.calledOnce).to.be.true;
    expect(handler.firstCall.args[0].detail).to.equal(false);
  });

  it('updates aria-checked when the loop state changes after connect', () => {
    el.setAttribute(MEDIA_LOOP, '');
    expect(el.getAttribute('aria-checked')).to.equal('true');
    el.removeAttribute(MEDIA_LOOP);
    expect(el.getAttribute('aria-checked')).to.equal('false');
  });

  it('shows the checked indicator while looping', () => {
    el.mediaLoop = true;
    const indicator = el.shadowRoot.querySelector('#checked-indicator');
    expect(getComputedStyle(indicator).display).to.equal('block');
  });

  it('reflects the mediaLoop property to the attribute', () => {
    el.mediaLoop = true;
    expect(el.hasAttribute(MEDIA_LOOP)).to.be.true;
    expect(el.mediaLoop).to.be.true;
    el.mediaLoop = false;
    expect(el.hasAttribute(MEDIA_LOOP)).to.be.false;
    expect(el.mediaLoop).to.be.false;
  });

  it('does not dispatch requests after being disabled', () => {
    const handler = spy();
    el.addEventListener(MediaUIEvents.MEDIA_LOOP_REQUEST, handler);
    el.disabled = true;
    el.click();
    expect(handler.called).to.be.false;
  });
});
