import { expect, fixture } from '@open-wc/testing';
import { sendKeys, sendMouse, resetMouse } from '@web/test-runner-commands';
import { restore, spy, type SinonSpy } from 'sinon';

import '../../src/js/media-controller.js';
import '../../src/js/media-control-bar.js';
import '../../src/js/media-play-button.js';
import '../../src/js/media-mute-button.js';
import '../../src/js/media-fullscreen-button.js';
import '../../src/js/media-pip-button.js';
import '../../src/js/media-captions-button.js';
import '../../src/js/media-seek-forward-button.js';
import '../../src/js/media-seek-backward-button.js';
import '../../src/js/media-tooltip.js';
import { MediaUIAttributes } from '../../src/js/constants.js';

// Positioning a tooltip starts with checkVisibility() and then measures layout
// (getComputedStyle + getBoundingClientRect). Each of these can force a synchronous
// style/layout pass of the whole document (checkVisibility() does in Safari when the
// page uses container queries). They must only
// happen while the tooltip can actually be seen (hover / keyboard focus), not on
// every attribute change, otherwise mounting a player in a large page freezes it.
// See https://github.com/muxinc/media-chrome/issues/1324
describe('media-chrome-button tooltip positioning', () => {
  let rectSpy: SinonSpy;
  let visibilitySpy: SinonSpy;

  // Counts both calls: a hidden tooltip returns early after checkVisibility(),
  // which on its own can force a layout.
  const tooltipMeasurements = () =>
    [...rectSpy.getCalls(), ...visibilitySpy.getCalls()].filter(
      (call) => (call.thisValue as Element).localName === 'media-tooltip'
    ).length;

  // Tooltips are positioned against their media-controller, so buttons need one.
  const mountButton = async () => {
    const controller = await fixture(
      `<media-controller style="width: 300px; height: 200px">
        <media-play-button></media-play-button>
      </media-controller>`
    );
    return controller.querySelector('media-play-button') as HTMLElement;
  };

  beforeEach(async () => {
    await customElements.whenDefined('media-tooltip');
    rectSpy = spy(Element.prototype, 'getBoundingClientRect');
    visibilitySpy = spy(Element.prototype, 'checkVisibility');
  });

  afterEach(async () => {
    restore();
    await resetMouse();
  });

  it('does not measure the tooltip on attribute changes while it is hidden', async () => {
    const el = await mountButton();
    rectSpy.resetHistory();
    visibilitySpy.resetHistory();

    el.toggleAttribute(MediaUIAttributes.MEDIA_PAUSED);
    el.toggleAttribute(MediaUIAttributes.MEDIA_PAUSED);
    el.setAttribute(MediaUIAttributes.MEDIA_LANG, 'en');
    el.setAttribute('tooltipplacement', 'bottom');

    expect(tooltipMeasurements()).to.equal(0);
  });

  it('does not check a display:none tooltip on attribute changes', async () => {
    const el = await mountButton();
    // notooltip hides the tooltip's slot, so checkVisibility() returns false and
    // the old code stopped before getBoundingClientRect.
    el.setAttribute('notooltip', '');
    rectSpy.resetHistory();
    visibilitySpy.resetHistory();

    el.toggleAttribute(MediaUIAttributes.MEDIA_PAUSED);
    el.toggleAttribute(MediaUIAttributes.MEDIA_PAUSED);

    expect(tooltipMeasurements()).to.equal(0);
  });

  it('does not measure tooltips while a controller mounts and propagates state', async () => {
    rectSpy.resetHistory();
    visibilitySpy.resetHistory();

    await fixture(`
      <media-controller>
        <video slot="media" muted></video>
        <media-control-bar>
          <media-play-button></media-play-button>
          <media-seek-backward-button></media-seek-backward-button>
          <media-seek-forward-button></media-seek-forward-button>
          <media-mute-button></media-mute-button>
          <media-captions-button></media-captions-button>
          <media-pip-button></media-pip-button>
          <media-fullscreen-button></media-fullscreen-button>
        </media-control-bar>
      </media-controller>
    `);

    expect(tooltipMeasurements()).to.equal(0);
  });

  it('still repositions the tooltip on attribute changes while hovered', async () => {
    const el = await mountButton();
    const { x, y, width, height } = el.getBoundingClientRect();
    await sendMouse({
      type: 'move',
      position: [Math.round(x + width / 2), Math.round(y + height / 2)],
    });
    expect(el.matches(':hover')).to.be.true;
    rectSpy.resetHistory();
    visibilitySpy.resetHistory();

    el.toggleAttribute(MediaUIAttributes.MEDIA_PAUSED);

    expect(tooltipMeasurements()).to.be.greaterThan(0);
  });

  it('still repositions the tooltip on attribute changes while keyboard focused', async () => {
    const el = await mountButton();
    // The controller itself is focusable and comes first in tab order.
    for (let i = 0; i < 5 && document.activeElement !== el; i++) {
      await sendKeys({ press: 'Tab' });
    }
    expect(el.matches(':focus-visible')).to.be.true;
    rectSpy.resetHistory();
    visibilitySpy.resetHistory();

    el.toggleAttribute(MediaUIAttributes.MEDIA_PAUSED);

    expect(tooltipMeasurements()).to.be.greaterThan(0);
  });

  it('measures the tooltip when it is shown on mouseenter', async () => {
    const el = await mountButton();
    rectSpy.resetHistory();
    visibilitySpy.resetHistory();

    el.dispatchEvent(new MouseEvent('mouseenter'));

    expect(tooltipMeasurements()).to.be.greaterThan(0);
  });
});
