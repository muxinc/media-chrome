import { assert, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import '../../../src/js/menu/media-rendition-menu.js';
import '../../../src/js/menu/media-rendition-menu-button.js';
import { MediaRenditionMenu } from '../../../src/js/menu/media-rendition-menu.js';
import { MediaUIEvents } from '../../../src/js/constants.js';

const labels = (menu: MediaRenditionMenu) =>
  menu.items.map((item) => item.textContent.trim());

const checkedValues = (menu: MediaRenditionMenu) =>
  menu.checkedItems.map((item) => item.value);

describe('<media-rendition-menu>', () => {
  let menu: MediaRenditionMenu;

  beforeEach(async () => {
    menu = await fixture<MediaRenditionMenu>(
      html`<media-rendition-menu></media-rendition-menu>`
    );
  });

  describe('static helpers', () => {
    it('formats a rendition by its smaller dimension', () => {
      assert.equal(
        MediaRenditionMenu.formatRendition({
          id: 'a',
          width: 1920,
          height: 1080,
        }),
        '1080p'
      );
      // Portrait video: the smaller side is the width.
      assert.equal(
        MediaRenditionMenu.formatRendition({
          id: 'b',
          width: 720,
          height: 1280,
        }),
        '720p'
      );
    });

    it('appends the bitrate when requested', () => {
      const rendition = { id: 'a', width: 1920, height: 1080 } as any;
      rendition.bitrate = 4_000_000;
      assert.equal(
        MediaRenditionMenu.formatRendition(rendition, { showBitrate: true }),
        '1080p (4 Mbps)'
      );
      rendition.bitrate = 500_000;
      assert.equal(
        MediaRenditionMenu.formatRendition(rendition, { showBitrate: true }),
        '1080p (0.5 Mbps)'
      );
    });

    it('ignores showBitrate when the rendition has no bitrate', () => {
      assert.equal(
        MediaRenditionMenu.formatRendition(
          { id: 'a', width: 1280, height: 720 },
          { showBitrate: true }
        ),
        '720p'
      );
    });

    it('sorts by height desc, then bitrate desc', () => {
      const list = [
        { id: 'a', height: 720, bitrate: 1 },
        { id: 'b', height: 1080, bitrate: 1 },
        { id: 'c', height: 720, bitrate: 3 },
        { id: 'd', height: 720 },
      ] as any[];
      list.sort(MediaRenditionMenu.compareRendition);
      assert.deepEqual(
        list.map((r) => r.id),
        ['b', 'c', 'a', 'd']
      );
    });
  });

  it('renders only a checked Auto item when there are no renditions', () => {
    assert.deepEqual(labels(menu), []);
    menu.setAttribute('mediaheight', '720');
    assert.deepEqual(labels(menu), ['Auto']);
    assert.deepEqual(checkedValues(menu), ['auto']);
    assert.equal(menu.items[0].dataset.description, 'Auto');
  });

  it('renders renditions from mediarenditionlist sorted by height with Auto last', () => {
    menu.setAttribute(
      'mediarenditionlist',
      'r360:640:360 r1080:1920:1080 r720:1280:720'
    );
    assert.deepEqual(labels(menu), ['1080p', '720p', '360p', 'Auto']);
    assert.deepEqual(
      menu.items.map((item) => item.value),
      ['r1080', 'r720', 'r360', 'auto']
    );
    assert.deepEqual(checkedValues(menu), ['auto']);
    assert.equal(menu.mediaRenditionList.length, 3);
    assert.isTrue(
      menu.items.every((item) => item.getAttribute('role') === 'menuitemradio')
    );
  });

  it('checks the selected rendition from mediarenditionselected', () => {
    menu.setAttribute('mediarenditionlist', 'r1080:1920:1080 r720:1280:720');
    menu.setAttribute('mediarenditionselected', 'r720');

    assert.equal(menu.mediaRenditionSelected, 'r720');
    assert.equal(menu.value, 'r720');
    assert.deepEqual(checkedValues(menu), ['r720']);
  });

  it('checks the selected rendition when the selection arrives before the list', () => {
    menu.setAttribute('mediarenditionselected', 'r720');
    menu.setAttribute('mediarenditionlist', 'r1080:1920:1080 r720:1280:720');
    assert.deepEqual(checkedValues(menu), ['r720']);
  });

  it('goes back to Auto when mediarenditionselected is removed', () => {
    menu.setAttribute('mediarenditionlist', 'r1080:1920:1080 r720:1280:720');
    menu.setAttribute('mediarenditionselected', 'r720');
    menu.removeAttribute('mediarenditionselected');
    assert.deepEqual(checkedValues(menu), ['auto']);
  });

  it('shows the current video height in the Auto label', () => {
    menu.setAttribute('mediarenditionlist', 'r1080:1920:1080 r720:1280:720');
    menu.mediaWidth = 1280;
    menu.mediaHeight = 720;

    assert.equal(menu.getAttribute('mediaheight'), '720');
    assert.equal(menu.mediaHeight, 720);
    assert.equal(menu.mediaWidth, 1280);

    const auto = menu.items.at(-1);
    assert.equal(auto.textContent.trim(), 'Auto (720p)');
    assert.equal(auto.dataset.description, 'Auto (720p)');
  });

  it('keeps plain Auto when only one dimension is known', () => {
    menu.setAttribute('mediarenditionlist', 'r1080:1920:1080');
    menu.setAttribute('mediaheight', '1080');
    assert.equal(menu.items.at(-1).textContent.trim(), 'Auto');
  });

  it('does not add the video height to Auto when a rendition is selected', () => {
    menu.setAttribute('mediarenditionlist', 'r1080:1920:1080 r720:1280:720');
    menu.setAttribute('mediawidth', '1920');
    menu.setAttribute('mediaheight', '1080');
    menu.setAttribute('mediarenditionselected', 'r720');
    assert.equal(menu.items.at(-1).textContent.trim(), 'Auto');
  });

  it('shows the bitrate only for renditions sharing a height', () => {
    menu.mediaRenditionList = [
      { id: 'lo', width: 1280, height: 720, bitrate: 1_000_000 },
      { id: 'hi', width: 1280, height: 720, bitrate: 3_000_000 },
      { id: 'fhd', width: 1920, height: 1080, bitrate: 6_000_000 },
    ] as any;

    assert.deepEqual(labels(menu), [
      '1080p',
      '720p (3 Mbps)',
      '720p (1 Mbps)',
      'Auto',
    ]);
    assert.deepEqual(
      menu.items.map((item) => item.value),
      ['fhd', 'hi', 'lo', 'auto']
    );
  });

  it('uses an overridden formatMenuItemText in subclasses', async () => {
    class CustomRenditionMenu extends MediaRenditionMenu {
      static formatMenuItemText(text: string) {
        return `[${text}]`;
      }
    }
    customElements.define('custom-rendition-menu', CustomRenditionMenu);
    const custom = await fixture<MediaRenditionMenu>(
      html`<custom-rendition-menu
        mediarenditionlist="r720:1280:720"
      ></custom-rendition-menu>`
    );
    assert.deepEqual(labels(custom), ['[720p]', '[Auto]']);
  });

  it('dispatches a rendition request with the item value when an item is clicked', async () => {
    menu.setAttribute('mediarenditionlist', 'r1080:1920:1080 r720:1280:720');
    const handler = spy();
    document.addEventListener(MediaUIEvents.MEDIA_RENDITION_REQUEST, handler);

    try {
      menu.items.find((item) => item.value === 'r1080').click();
      assert.equal(handler.callCount, 1);
      const event = handler.firstCall.args[0] as CustomEvent;
      assert.equal(event.detail, 'r1080');
      assert.isTrue(event.bubbles);
      assert.isTrue(event.composed);
      assert.deepEqual(checkedValues(menu), ['r1080']);

      menu.items.find((item) => item.value === 'auto').click();
      assert.equal(handler.callCount, 2);
      assert.equal(handler.secondCall.args[0].detail, 'auto');
    } finally {
      document.removeEventListener(
        MediaUIEvents.MEDIA_RENDITION_REQUEST,
        handler
      );
    }
  });

  it('does not dispatch when clicking the already checked item', () => {
    menu.setAttribute('mediarenditionlist', 'r720:1280:720');
    const handler = spy();
    menu.addEventListener(MediaUIEvents.MEDIA_RENDITION_REQUEST, handler);
    menu.items.find((item) => item.value === 'auto').click();
    assert.equal(handler.callCount, 0);
  });

  it('stops dispatching requests after being disconnected', () => {
    menu.setAttribute('mediarenditionlist', 'r720:1280:720');
    const handler = spy();
    menu.addEventListener(MediaUIEvents.MEDIA_RENDITION_REQUEST, handler);
    menu.remove();
    menu.value = 'r720';
    assert.equal(menu.value, 'r720');
    assert.equal(handler.callCount, 0);
  });

  it('resolves the anchor element to the rendition menu button in the media controller', async () => {
    const controller = await fixture<HTMLElement>(html`
      <media-controller>
        <media-rendition-menu anchor="auto" hidden></media-rendition-menu>
        <media-rendition-menu-button></media-rendition-menu-button>
      </media-controller>
    `);
    const nested = controller.querySelector(
      'media-rendition-menu'
    ) as MediaRenditionMenu;
    assert.equal(
      nested.anchorElement,
      controller.querySelector('media-rendition-menu-button')
    );
  });

  it('resolves the anchor element by id when anchor is not auto', async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <button id="my-anchor"></button>
        <media-rendition-menu anchor="my-anchor" hidden></media-rendition-menu>
      </div>
    `);
    const nested = container.querySelector(
      'media-rendition-menu'
    ) as MediaRenditionMenu;
    assert.equal(nested.anchorElement, container.querySelector('#my-anchor'));
  });
});
