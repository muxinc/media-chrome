import { assert, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-audio-track-menu.js';
import '../../../src/js/menu/media-audio-track-menu-button.js';
import { MediaAudioTrackMenu } from '../../../src/js/menu/media-audio-track-menu.js';
import { MediaUIEvents } from '../../../src/js/constants.js';

const labels = (menu: MediaAudioTrackMenu) =>
  menu.items.map((item) => item.textContent.trim());

const checkedValues = (menu: MediaAudioTrackMenu) =>
  menu.checkedItems.map((item) => item.value);

const TRACKS =
  '2:alternative:es:Spanish 10:commentary:en:Commentary 1:main:en:English';

describe('<media-audio-track-menu>', () => {
  let menu: MediaAudioTrackMenu;

  beforeEach(async () => {
    menu = await fixture<MediaAudioTrackMenu>(
      html`<media-audio-track-menu></media-audio-track-menu>`
    );
  });

  it('renders tracks from mediaaudiotracklist sorted numerically by id', () => {
    menu.setAttribute('mediaaudiotracklist', TRACKS);

    assert.deepEqual(labels(menu), ['English', 'Spanish', 'Commentary']);
    assert.deepEqual(
      menu.items.map((item) => item.value),
      ['1', '2', '10']
    );
    assert.deepEqual(
      menu.mediaAudioTrackList.map((track) => track.language),
      ['en', 'es', 'en']
    );
    assert.isTrue(
      menu.items.every((item) => item.getAttribute('role') === 'menuitemradio')
    );
  });

  it('checks the track from mediaaudiotrackenabled', () => {
    menu.setAttribute('mediaaudiotracklist', TRACKS);
    menu.setAttribute('mediaaudiotrackenabled', '2');

    assert.equal(menu.mediaAudioTrackEnabled, '2');
    assert.deepEqual(checkedValues(menu), ['2']);

    menu.mediaAudioTrackEnabled = '10';
    assert.equal(menu.getAttribute('mediaaudiotrackenabled'), '10');
    assert.deepEqual(checkedValues(menu), ['10']);
  });

  it('returns an empty enabled track id by default', () => {
    assert.equal(menu.mediaAudioTrackEnabled, '');
  });

  it('checks the enabled track from the mediaAudioTrackList property', () => {
    menu.mediaAudioTrackList = [
      { id: 'a', label: 'English', enabled: false },
      { id: 'b', label: 'Deutsch', enabled: true },
    ] as any;
    assert.deepEqual(labels(menu), ['English', 'Deutsch']);
    assert.deepEqual(checkedValues(menu), ['b']);
  });

  it('does not re-render when the same list is set again', () => {
    const list = [
      { id: '1', label: 'English' },
      { id: '2', label: 'Spanish' },
    ] as any;
    menu.mediaAudioTrackList = list;
    const firstItems = menu.items;
    menu.mediaAudioTrackList = [...list];
    assert.equal(menu.items.length, 2);
    assert.isTrue(menu.items.every((item, i) => item === firstItems[i]));
  });

  it('uses an overridden formatMenuItemText in subclasses', async () => {
    class CustomAudioTrackMenu extends MediaAudioTrackMenu {
      static formatMenuItemText(text: string, track?: any) {
        return `${text} (${track.language})`;
      }
    }
    customElements.define('custom-audio-track-menu', CustomAudioTrackMenu);
    const custom = await fixture<MediaAudioTrackMenu>(
      html`<custom-audio-track-menu
        mediaaudiotracklist=${TRACKS}
      ></custom-audio-track-menu>`
    );
    assert.deepEqual(labels(custom), [
      'English (en)',
      'Spanish (es)',
      'Commentary (en)',
    ]);
  });

  it('dispatches an audio track request with the track id when selected', async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <media-audio-track-menu
          mediaaudiotracklist=${TRACKS}
          mediaaudiotrackenabled="1"
        ></media-audio-track-menu>
      </div>
    `);
    const nested = container.querySelector(
      'media-audio-track-menu'
    ) as MediaAudioTrackMenu;
    const handler = spy();
    container.addEventListener(
      MediaUIEvents.MEDIA_AUDIO_TRACK_REQUEST,
      handler
    );

    nested.items.find((item) => item.value === '2').click();

    assert.equal(handler.callCount, 1);
    const event = handler.firstCall.args[0] as CustomEvent;
    assert.equal(event.detail, '2');
    assert.isTrue(event.bubbles);
    assert.isTrue(event.composed);
    assert.deepEqual(checkedValues(nested), ['2']);
  });

  it('stops dispatching requests after being disconnected', () => {
    menu.setAttribute('mediaaudiotracklist', TRACKS);
    menu.setAttribute('mediaaudiotrackenabled', '1');
    const handler = spy();
    menu.addEventListener(MediaUIEvents.MEDIA_AUDIO_TRACK_REQUEST, handler);
    menu.remove();
    menu.value = '2';
    assert.equal(menu.value, '2');
    assert.equal(handler.callCount, 0);
  });

  it('resolves the anchor element to the audio track menu button in the media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-audio-track-menu anchor="auto" hidden></media-audio-track-menu>
        <media-audio-track-menu-button></media-audio-track-menu-button>
      </media-controller>
    `);
    const nested = controller.querySelector(
      'media-audio-track-menu'
    ) as MediaAudioTrackMenu;
    assert.equal(
      nested.anchorElement,
      controller.querySelector('media-audio-track-menu-button')
    );
  });

  it('has no auto anchor element outside a media controller', async () => {
    const el = await fixture<MediaAudioTrackMenu>(
      html`<media-audio-track-menu
        anchor="auto"
        hidden
      ></media-audio-track-menu>`
    );
    assert.notExists(el.anchorElement);
  });
});
