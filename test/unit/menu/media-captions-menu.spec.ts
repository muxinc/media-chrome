import { assert, fixture, html } from '@open-wc/testing';
import { spy, type SinonSpy } from 'sinon';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-captions-menu.js';
import '../../../src/js/menu/media-captions-menu-button.js';
import { MediaCaptionsMenu } from '../../../src/js/menu/media-captions-menu.js';
import { MediaUIEvents } from '../../../src/js/constants.js';

const labels = (menu: MediaCaptionsMenu) =>
  menu.items.map((item) => item.textContent.trim());

const checkedValues = (menu: MediaCaptionsMenu) =>
  menu.checkedItems.map((item) => item.value);

const SUBS_LIST = 'sb:en:English cc:en:English%20CC sb:es:Espa%C3%B1ol';

describe('<media-captions-menu>', () => {
  let menu: MediaCaptionsMenu;
  let showSpy: SinonSpy;
  let disableSpy: SinonSpy;

  beforeEach(async () => {
    menu = await fixture<MediaCaptionsMenu>(
      html`<media-captions-menu></media-captions-menu>`
    );
    showSpy = spy();
    disableSpy = spy();
    menu.addEventListener(MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST, showSpy);
    menu.addEventListener(
      MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST,
      disableSpy
    );
  });

  it('renders an Off item followed by each subtitle track', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);

    assert.deepEqual(labels(menu), ['Off', 'English', 'English CC', 'Español']);
    assert.deepEqual(
      menu.items.map((item) => item.value),
      ['off', 'sb:en:English', 'cc:en:English%20CC', 'sb:es:Espa%C3%B1ol']
    );
    assert.deepEqual(checkedValues(menu), ['off']);
  });

  it('marks closed caption tracks with the captions indicator', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);

    const withIndicator = menu.items.filter((item) =>
      item.querySelector('svg[part~="captions-indicator"]')
    );
    assert.deepEqual(
      withIndicator.map((item) => item.value),
      ['cc:en:English%20CC']
    );
  });

  it('checks the showing track from mediasubtitlesshowing', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);
    menu.setAttribute('mediasubtitlesshowing', 'sb:es:Espa%C3%B1ol');

    assert.deepEqual(checkedValues(menu), ['sb:es:Espa%C3%B1ol']);
    assert.deepEqual(menu.mediaSubtitlesShowing, [
      { kind: 'subtitles', language: 'es', label: 'Español' },
    ]);
  });

  it('checks Off again when mediasubtitlesshowing is removed', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);
    menu.setAttribute('mediasubtitlesshowing', 'sb:en:English');
    menu.removeAttribute('mediasubtitlesshowing');
    assert.deepEqual(checkedValues(menu), ['off']);
  });

  it('does not dispatch requests for media state changes', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);
    menu.setAttribute('mediasubtitlesshowing', 'sb:en:English');
    menu.setAttribute('mediasubtitlesshowing', 'sb:es:Espa%C3%B1ol');
    assert.equal(showSpy.callCount, 0);
    assert.equal(disableSpy.callCount, 0);
  });

  it('requests showing a track when one is selected and none are showing', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);
    menu.items.find((item) => item.value === 'sb:en:English').click();

    assert.equal(disableSpy.callCount, 0);
    assert.equal(showSpy.callCount, 1);
    const event = showSpy.firstCall.args[0] as CustomEvent;
    assert.equal(event.detail, 'sb:en:English');
    assert.isTrue(event.bubbles);
    assert.isTrue(event.composed);
  });

  it('disables the showing tracks before showing a newly selected one', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);
    menu.setAttribute('mediasubtitlesshowing', 'sb:en:English');

    menu.items.find((item) => item.value === 'cc:en:English%20CC').click();

    assert.equal(disableSpy.callCount, 1);
    assert.deepEqual(disableSpy.firstCall.args[0].detail, [
      { kind: 'subtitles', language: 'en', label: 'English' },
    ]);
    assert.equal(showSpy.callCount, 1);
    assert.equal(showSpy.firstCall.args[0].detail, 'cc:en:English%20CC');
    assert(
      disableSpy.calledBefore(showSpy),
      'disable is dispatched before show'
    );
  });

  it('disables the showing tracks when Off is selected', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);
    menu.setAttribute('mediasubtitlesshowing', 'sb:en:English');

    menu.items.find((item) => item.value === 'off').click();

    assert.equal(disableSpy.callCount, 1);
    assert.deepEqual(disableSpy.firstCall.args[0].detail, [
      { kind: 'subtitles', language: 'en', label: 'English' },
    ]);
    assert.deepEqual(checkedValues(menu), ['off']);
  });

  it('bubbles requests to ancestors', async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <media-captions-menu
          mediasubtitleslist=${SUBS_LIST}
        ></media-captions-menu>
      </div>
    `);
    const nested = container.querySelector(
      'media-captions-menu'
    ) as MediaCaptionsMenu;
    const handler = spy();
    container.addEventListener(
      MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
      handler
    );
    nested.items.find((item) => item.value === 'sb:es:Espa%C3%B1ol').click();
    assert.equal(handler.callCount, 1);
    assert.equal(handler.firstCall.args[0].detail, 'sb:es:Espa%C3%B1ol');
  });

  it('stops dispatching requests after being disconnected', () => {
    menu.setAttribute('mediasubtitleslist', SUBS_LIST);
    menu.remove();
    menu.value = 'sb:en:English';
    assert.equal(menu.value, 'sb:en:English');
    assert.equal(showSpy.callCount, 0);
  });

  describe('list properties', () => {
    it('serializes mediaSubtitlesList to the attribute', () => {
      menu.mediaSubtitlesList = [
        { kind: 'captions', language: 'en', label: 'English' },
        { kind: 'subtitles', language: 'fr', label: 'Français' },
      ];
      assert.equal(
        menu.getAttribute('mediasubtitleslist'),
        'cc:en:English sb:fr:Fran%C3%A7ais'
      );
      assert.deepEqual(menu.mediaSubtitlesList, [
        { kind: 'captions', language: 'en', label: 'English' },
        { kind: 'subtitles', language: 'fr', label: 'Français' },
      ]);
      assert.deepEqual(labels(menu), ['Off', 'English', 'Français']);
    });

    it('removes the attribute for empty or nullish lists', () => {
      menu.mediaSubtitlesList = [
        { kind: 'subtitles', language: 'en', label: 'English' },
      ];
      menu.mediaSubtitlesList = [];
      assert.isFalse(menu.hasAttribute('mediasubtitleslist'));
      assert.deepEqual(menu.mediaSubtitlesList, []);

      menu.mediaSubtitlesShowing = [
        { kind: 'subtitles', language: 'en', label: 'English' },
      ];
      menu.mediaSubtitlesShowing = null;
      assert.isFalse(menu.hasAttribute('mediasubtitlesshowing'));
      assert.deepEqual(menu.mediaSubtitlesShowing, []);
    });

    it('does not rewrite the attribute when the list is unchanged', () => {
      const list = [{ kind: 'subtitles', language: 'en', label: 'English' }];
      menu.mediaSubtitlesShowing = list as any;
      const setAttributeSpy = spy(menu, 'setAttribute');
      menu.mediaSubtitlesShowing = list as any;
      assert.equal(setAttributeSpy.callCount, 0);
      setAttributeSpy.restore();
    });
  });

  it('uses a custom checked-indicator when slotted', async () => {
    const custom = await fixture<MediaCaptionsMenu>(html`
      <media-captions-menu mediasubtitleslist="sb:en:English">
        <span slot="checked-indicator" class="my-check">*</span>
      </media-captions-menu>
    `);
    assert.isTrue(
      custom.items.every((item) => item.querySelector('.my-check'))
    );
  });

  it('resolves the anchor element to the captions menu button in the media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-captions-menu anchor="auto" hidden></media-captions-menu>
        <media-captions-menu-button></media-captions-menu-button>
      </media-controller>
    `);
    const nested = controller.querySelector(
      'media-captions-menu'
    ) as MediaCaptionsMenu;
    assert.equal(
      nested.anchorElement,
      controller.querySelector('media-captions-menu-button')
    );
  });
});
