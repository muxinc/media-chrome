import { assert, fixture, html } from '@open-wc/testing';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-rendition-menu.js';
import '../../../src/js/menu/media-rendition-menu-button.js';
import { MediaRenditionMenuButton } from '../../../src/js/menu/media-rendition-menu-button.js';

// Outside a <media-controller> (and without invoketarget) the button currently
// throws on connect because getMediaController() returns null, so the
// standalone cases are rendered inside a controller.
const buttonInController = async () => {
  const controller = await fixture<HTMLElement>(
    html`<media-controller
      ><media-rendition-menu-button></media-rendition-menu-button
    ></media-controller>`
  );
  return controller.querySelector(
    'media-rendition-menu-button'
  ) as MediaRenditionMenuButton;
};

describe('<media-rendition-menu-button>', () => {
  it('has a quality aria-label and tooltip', async () => {
    const button = await buttonInController();
    assert.equal(button.getAttribute('aria-label'), 'quality');
    const tooltip = button.shadowRoot.querySelector(
      'slot[name="tooltip-content"]'
    );
    assert.equal(tooltip.textContent.trim(), 'Quality');
    assert.exists(button.shadowRoot.querySelector('slot[name="icon"] svg'));
  });

  it('reflects mediarenditionselected and mediaheight', async () => {
    const button = await buttonInController();
    button.mediaRenditionSelected = 'r720';
    assert.equal(button.getAttribute('mediarenditionselected'), 'r720');
    assert.equal(button.mediaRenditionSelected, 'r720');

    button.mediaHeight = 720;
    assert.equal(button.getAttribute('mediaheight'), '720');
    assert.equal(button.mediaHeight, 720);
  });

  it('targets the rendition menu in its media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-rendition-menu hidden></media-rendition-menu>
        <media-rendition-menu-button></media-rendition-menu-button>
      </media-controller>
    `);
    const button = controller.querySelector(
      'media-rendition-menu-button'
    ) as MediaRenditionMenuButton;
    const menu = controller.querySelector('media-rendition-menu');

    assert.equal(button.invokeTargetElement, menu);
    assert.equal(button.getAttribute('aria-haspopup'), 'menu');
  });

  it('prefers the invoketarget attribute when set', async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <media-rendition-menu id="quality-menu" hidden></media-rendition-menu>
        <media-rendition-menu-button
          invoketarget="quality-menu"
        ></media-rendition-menu-button>
      </div>
    `);
    const button = container.querySelector(
      'media-rendition-menu-button'
    ) as MediaRenditionMenuButton;
    assert.equal(
      button.invokeTargetElement,
      container.querySelector('#quality-menu')
    );
  });

  it('opens the rendition menu when clicked', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-rendition-menu hidden></media-rendition-menu>
        <media-rendition-menu-button></media-rendition-menu-button>
      </media-controller>
    `);
    const button = controller.querySelector(
      'media-rendition-menu-button'
    ) as MediaRenditionMenuButton;
    const menu = controller.querySelector('media-rendition-menu');

    assert.isTrue(menu.hidden);
    button.click();
    assert.isFalse(menu.hidden);
    assert.equal(button.getAttribute('aria-expanded'), 'true');
  });
});
