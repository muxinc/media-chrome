import { assert, fixture, html } from '@open-wc/testing';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-captions-menu.js';
import '../../../src/js/menu/media-captions-menu-button.js';
import { MediaCaptionsMenuButton } from '../../../src/js/menu/media-captions-menu-button.js';
import { Es } from '../../../src/js/lang/es.js';
import { addTranslation, setLanguage } from '../../../src/js/utils/i18n.js';

const tooltipText = (el: HTMLElement) =>
  el.shadowRoot
    .querySelector('slot[name="tooltip-content"]')
    .textContent.trim();

describe('<media-captions-menu-button>', () => {
  let button: MediaCaptionsMenuButton;

  beforeEach(async () => {
    button = await fixture<MediaCaptionsMenuButton>(
      html`<media-captions-menu-button></media-captions-menu-button>`
    );
  });

  it('has a closed captions aria-label and tooltip', () => {
    assert.equal(button.getAttribute('aria-label'), 'closed captions');
    assert.equal(tooltipText(button), 'Captions');
    assert.exists(button.shadowRoot.querySelector('slot[name="on"] svg'));
    assert.exists(button.shadowRoot.querySelector('slot[name="off"] svg'));
  });

  it('flags captions as disabled when nothing is showing', () => {
    assert.equal(button.getAttribute('data-captions-enabled'), 'false');
  });

  it('flags captions as enabled while subtitles are showing', () => {
    button.setAttribute('mediasubtitleslist', 'sb:en:English sb:es:Spanish');
    assert.equal(button.getAttribute('data-captions-enabled'), 'false');

    button.setAttribute('mediasubtitlesshowing', 'sb:en:English');
    assert.equal(button.getAttribute('data-captions-enabled'), 'true');

    button.removeAttribute('mediasubtitlesshowing');
    assert.equal(button.getAttribute('data-captions-enabled'), 'false');
  });

  it('reflects enabled state when connected with showing subtitles', async () => {
    const el = await fixture<MediaCaptionsMenuButton>(
      html`<media-captions-menu-button
        mediasubtitlesshowing="cc:en:English"
      ></media-captions-menu-button>`
    );
    assert.equal(el.getAttribute('data-captions-enabled'), 'true');
  });

  it('serializes subtitle list properties to attributes', () => {
    button.mediaSubtitlesList = [
      { kind: 'subtitles', language: 'en', label: 'English' },
      { kind: 'captions', language: 'en', label: 'English CC' },
    ];
    assert.equal(
      button.getAttribute('mediasubtitleslist'),
      'sb:en:English cc:en:English%20CC'
    );
    assert.deepEqual(button.mediaSubtitlesList, [
      { kind: 'subtitles', language: 'en', label: 'English' },
      { kind: 'captions', language: 'en', label: 'English CC' },
    ]);

    button.mediaSubtitlesShowing = [
      { kind: 'captions', language: 'en', label: 'English CC' },
    ];
    assert.equal(
      button.getAttribute('mediasubtitlesshowing'),
      'cc:en:English%20CC'
    );
    assert.equal(button.getAttribute('data-captions-enabled'), 'true');

    button.mediaSubtitlesShowing = [];
    assert.isFalse(button.hasAttribute('mediasubtitlesshowing'));
    assert.deepEqual(button.mediaSubtitlesShowing, []);
    assert.equal(button.getAttribute('data-captions-enabled'), 'false');

    button.mediaSubtitlesList = undefined;
    assert.isFalse(button.hasAttribute('mediasubtitleslist'));
    assert.deepEqual(button.mediaSubtitlesList, []);
  });

  it('updates the aria-label and tooltip when the media language changes', () => {
    addTranslation('es', Es);
    setLanguage('es');
    try {
      button.setAttribute('medialang', 'es');
      assert.equal(button.getAttribute('aria-label'), 'subtítulos');
      assert.equal(tooltipText(button), 'Subtítulos');
    } finally {
      setLanguage('en');
    }
  });

  it('has no invoke target outside a media controller', () => {
    assert.notExists(button.invokeTargetElement);
    assert.isFalse(button.hasAttribute('aria-haspopup'));
  });

  it('targets and opens the captions menu in its media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-captions-menu hidden></media-captions-menu>
        <media-captions-menu-button></media-captions-menu-button>
      </media-controller>
    `);
    const el = controller.querySelector(
      'media-captions-menu-button'
    ) as MediaCaptionsMenuButton;
    const menu = controller.querySelector('media-captions-menu');

    assert.equal(el.invokeTargetElement, menu);
    assert.equal(el.getAttribute('aria-haspopup'), 'menu');

    el.click();
    assert.isFalse(menu.hidden);
    assert.equal(el.getAttribute('aria-expanded'), 'true');
  });

  it('prefers the invoketarget attribute when set', async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <media-captions-menu id="cc-menu" hidden></media-captions-menu>
        <media-captions-menu-button
          invoketarget="cc-menu"
        ></media-captions-menu-button>
      </div>
    `);
    const el = container.querySelector(
      'media-captions-menu-button'
    ) as MediaCaptionsMenuButton;
    assert.equal(el.invokeTargetElement, container.querySelector('#cc-menu'));
  });
});
