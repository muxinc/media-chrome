import { assert, fixture, html } from '@open-wc/testing';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-playback-rate-menu.js';
import '../../../src/js/menu/media-playback-rate-menu-button.js';
import { MediaPlaybackRateMenuButton } from '../../../src/js/menu/media-playback-rate-menu-button.js';

const iconText = (el: HTMLElement) =>
  el.shadowRoot.querySelector('slot[name="icon"]').innerHTML;

// Outside a <media-controller> (and without invoketarget) the button currently
// throws on connect because getMediaController() returns null, so the
// cases below are rendered inside a controller.
const buttonInController = async () => {
  const controller = await fixture<HTMLElement>(
    html`<media-controller
      ><media-playback-rate-menu-button></media-playback-rate-menu-button
    ></media-controller>`
  );
  return controller.querySelector(
    'media-playback-rate-menu-button'
  ) as MediaPlaybackRateMenuButton;
};

describe('<media-playback-rate-menu-button>', () => {
  it('shows 1x and a playback rate tooltip by default', async () => {
    const button = await buttonInController();
    assert.equal(button.mediaPlaybackRate, 1);
    assert.equal(iconText(button), '1x');
    assert.equal(
      button.shadowRoot
        .querySelector('slot[name="tooltip-content"]')
        .textContent.trim(),
      'Playback rate'
    );
  });

  it('renders the initial mediaplaybackrate', async () => {
    // Standalone (a controller would propagate its own rate); invoketarget
    // avoids the media controller lookup.
    const button = await fixture<MediaPlaybackRateMenuButton>(
      html`<media-playback-rate-menu-button
        invoketarget="none"
        mediaplaybackrate="1.5"
      ></media-playback-rate-menu-button>`
    );
    assert.equal(iconText(button), '1.5x');
    assert.equal(button.getAttribute('aria-label'), 'Playback rate 1.5');
  });

  it('updates the label and aria-label when mediaplaybackrate changes', async () => {
    const button = await buttonInController();
    button.mediaPlaybackRate = 2;
    assert.equal(button.getAttribute('mediaplaybackrate'), '2');
    assert.equal(iconText(button), '2x');
    assert.equal(button.getAttribute('aria-label'), 'Playback rate 2');
  });

  it('rounds float-precision drift in the displayed rate', async () => {
    const button = await buttonInController();
    button.setAttribute('mediaplaybackrate', '1.1499999999999999');
    assert.equal(iconText(button), '1.15x');
    assert.equal(button.getAttribute('aria-label'), 'Playback rate 1.15');
  });

  it('falls back to 1x for missing or invalid rates', async () => {
    const button = await buttonInController();
    button.setAttribute('mediaplaybackrate', 'not-a-number');
    assert.equal(iconText(button), '1x');
    assert.equal(button.getAttribute('aria-label'), 'Playback rate 1');

    button.setAttribute('mediaplaybackrate', '2');
    button.removeAttribute('mediaplaybackrate');
    assert.equal(iconText(button), '1x');
    assert.equal(button.mediaPlaybackRate, 1);
  });

  it('targets and opens the playback rate menu in its media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-playback-rate-menu hidden></media-playback-rate-menu>
        <media-playback-rate-menu-button></media-playback-rate-menu-button>
      </media-controller>
    `);
    const button = controller.querySelector(
      'media-playback-rate-menu-button'
    ) as MediaPlaybackRateMenuButton;
    const menu = controller.querySelector('media-playback-rate-menu');

    assert.equal(button.invokeTargetElement, menu);
    assert.equal(button.getAttribute('aria-haspopup'), 'menu');

    button.click();
    assert.isFalse(menu.hidden);
    assert.equal(button.getAttribute('aria-expanded'), 'true');
  });

  it('prefers the invoketarget attribute when set', async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <media-playback-rate-menu
          id="rate-menu"
          hidden
        ></media-playback-rate-menu>
        <media-playback-rate-menu-button
          invoketarget="rate-menu"
        ></media-playback-rate-menu-button>
      </div>
    `);
    const button = container.querySelector(
      'media-playback-rate-menu-button'
    ) as MediaPlaybackRateMenuButton;
    assert.equal(
      button.invokeTargetElement,
      container.querySelector('#rate-menu')
    );
  });
});
