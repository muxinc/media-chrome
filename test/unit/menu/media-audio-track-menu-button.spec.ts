import { assert, fixture, html } from '@open-wc/testing';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-audio-track-menu.js';
import '../../../src/js/menu/media-audio-track-menu-button.js';
import { MediaAudioTrackMenuButton } from '../../../src/js/menu/media-audio-track-menu-button.js';
import { addTranslation, setLanguage } from '../../../src/js/utils/i18n.js';

const tooltipText = (el: HTMLElement) =>
  el.shadowRoot
    .querySelector('slot[name="tooltip-content"]')
    .textContent.trim();

describe('<media-audio-track-menu-button>', () => {
  let button: MediaAudioTrackMenuButton;

  beforeEach(async () => {
    button = await fixture<MediaAudioTrackMenuButton>(
      html`<media-audio-track-menu-button></media-audio-track-menu-button>`
    );
  });

  it('has an Audio aria-label and tooltip', () => {
    assert.equal(button.getAttribute('aria-label'), 'Audio');
    assert.equal(tooltipText(button), 'Audio');
    assert.exists(button.shadowRoot.querySelector('slot[name="icon"] svg'));
  });

  it('reflects mediaaudiotrackenabled', () => {
    assert.equal(button.mediaAudioTrackEnabled, '');
    button.mediaAudioTrackEnabled = '2';
    assert.equal(button.getAttribute('mediaaudiotrackenabled'), '2');
    assert.equal(button.mediaAudioTrackEnabled, '2');
  });

  it('updates the aria-label and tooltip when the media language changes', () => {
    addTranslation('xx', { Audio: 'Sonido' });
    setLanguage('xx');
    try {
      button.setAttribute('medialang', 'xx');
      assert.equal(button.getAttribute('aria-label'), 'Sonido');
      assert.equal(tooltipText(button), 'Sonido');
    } finally {
      setLanguage('en');
    }
  });

  it('has no invoke target outside a media controller', () => {
    assert.notExists(button.invokeTargetElement);
    assert.isFalse(button.hasAttribute('aria-haspopup'));
  });

  it('targets and opens the audio track menu in its media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-audio-track-menu hidden></media-audio-track-menu>
        <media-audio-track-menu-button></media-audio-track-menu-button>
      </media-controller>
    `);
    const el = controller.querySelector(
      'media-audio-track-menu-button'
    ) as MediaAudioTrackMenuButton;
    const menu = controller.querySelector('media-audio-track-menu');

    assert.equal(el.invokeTargetElement, menu);
    assert.equal(el.getAttribute('aria-haspopup'), 'menu');

    el.click();
    assert.isFalse(menu.hidden);
    assert.equal(el.getAttribute('aria-expanded'), 'true');
  });

  it('prefers the invoketarget attribute when set', async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <media-audio-track-menu id="audio-menu" hidden></media-audio-track-menu>
        <media-audio-track-menu-button
          invoketarget="audio-menu"
        ></media-audio-track-menu-button>
      </div>
    `);
    const el = container.querySelector(
      'media-audio-track-menu-button'
    ) as MediaAudioTrackMenuButton;
    assert.equal(
      el.invokeTargetElement,
      container.querySelector('#audio-menu')
    );
  });
});
