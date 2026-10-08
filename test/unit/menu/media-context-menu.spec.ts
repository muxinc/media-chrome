import { assert, fixture, html } from '@open-wc/testing';
import { stub } from 'sinon';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-context-menu.js';
import '../../../src/js/menu/media-context-menu-item.js';
import { MediaChromeMenu } from '../../../src/js/menu/media-chrome-menu.js';
import { MediaChromeMenuItem } from '../../../src/js/menu/media-chrome-menu-item.js';
import { MediaContextMenu } from '../../../src/js/menu/media-context-menu.js';
import { MediaContextMenuItem } from '../../../src/js/menu/media-context-menu-item.js';
import type { MediaController } from '../../../src/js/media-controller.js';

function contextmenu(target: EventTarget, clientX = 0, clientY = 0) {
  const event = new MouseEvent('contextmenu', {
    bubbles: true,
    composed: true,
    cancelable: true,
    clientX,
    clientY,
  });
  target.dispatchEvent(event);
  return event;
}

function mousedown(target: EventTarget, button = 0) {
  target.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, composed: true, button })
  );
}

describe('<media-context-menu>', () => {
  let controller: MediaController;
  let video: HTMLVideoElement;
  let menu: MediaContextMenu;

  beforeEach(async () => {
    controller = await fixture<MediaController>(html`
      <media-controller>
        <video slot="media" muted playsinline></video>
        <media-control-bar>
          <button id="bar-button">bar</button>
        </media-control-bar>
        <media-context-menu>
          <media-context-menu-item>
            <button id="plain-action">Action</button>
          </media-context-menu-item>
          <media-context-menu-item>
            <button invoke="copy">Copy URL</button>
            <input slot="copy" value="https://example.com/video" />
          </media-context-menu-item>
        </media-context-menu>
      </media-controller>
    `);
    video = controller.querySelector('video');
    menu = controller.querySelector<MediaContextMenu>('media-context-menu');
  });

  it('is a hidden menu that opts out of autohide', () => {
    assert.instanceOf(menu, MediaChromeMenu);
    assert.isTrue(menu.hidden);
    assert.isTrue(menu.hasAttribute('noautohide'));
    assert.equal(menu.getAttribute('role'), 'menu');
    assert.lengthOf(menu.items, 2);
  });

  it('opens at the pointer position on contextmenu over the video', () => {
    const event = contextmenu(video, 12, 34);

    assert.isTrue(event.defaultPrevented, 'native context menu prevented');
    assert.isFalse(menu.hidden);
    assert.equal(menu.style.position, 'fixed');
    assert.equal(menu.style.left, '12px');
    assert.equal(menu.style.top, '34px');
  });

  it('toggles closed on a second contextmenu over the video', () => {
    contextmenu(video);
    const second = contextmenu(video);

    assert.isTrue(menu.hidden);
    assert.isFalse(second.defaultPrevented, 'native menu shows instead');
  });

  it('ignores contextmenu events from other elements', () => {
    const event = contextmenu(controller.querySelector('#bar-button'));

    assert.isTrue(menu.hidden);
    assert.isFalse(event.defaultPrevented);
  });

  it('closes on Escape', () => {
    contextmenu(video);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    assert.isTrue(menu.hidden);
  });

  it('closes on mousedown outside of the menu', () => {
    contextmenu(video);
    mousedown(document.body);
    assert.isTrue(menu.hidden);
  });

  it('stays open on a right-button mousedown over the video', () => {
    contextmenu(video);
    mousedown(video, 2);
    assert.isFalse(menu.hidden);
  });

  it('closes on a left-button mousedown over the video', () => {
    contextmenu(video);
    mousedown(video, 0);
    assert.isTrue(menu.hidden);
  });

  it('closes after clicking a menu item', () => {
    contextmenu(video);
    (controller.querySelector('#plain-action') as HTMLElement).click();
    assert.isTrue(menu.hidden);
  });

  it('copies the input value with a copy button', () => {
    if (!navigator.clipboard) return;
    const writeText = stub(navigator.clipboard, 'writeText').resolves();
    try {
      contextmenu(video);
      (
        controller.querySelector('button[invoke="copy"]') as HTMLElement
      ).click();

      assert.isTrue(writeText.calledOnceWith('https://example.com/video'));
      assert.isTrue(menu.hidden);
    } finally {
      writeText.restore();
    }
  });

  it('does not copy from a regular button', () => {
    if (!navigator.clipboard) return;
    const writeText = stub(navigator.clipboard, 'writeText').resolves();
    try {
      contextmenu(video);
      (controller.querySelector('#plain-action') as HTMLElement).click();
      assert.isFalse(writeText.called);
    } finally {
      writeText.restore();
    }
  });

  // Removing only the menu currently throws in disconnectedCallback because
  // getMediaController() is null once detached, so remove the whole player.
  it('stops listening to the controller once disconnected', () => {
    controller.remove();
    const event = contextmenu(video);

    assert.isFalse(event.defaultPrevented);
    assert.isTrue(menu.hidden);
  });

  it('opens for custom media elements with media attributes', async () => {
    const el = await fixture<MediaController>(html`
      <media-controller>
        <div slot="media"><my-player src="about:blank"></my-player></div>
        <media-context-menu></media-context-menu>
      </media-controller>
    `);
    const contextMenu =
      el.querySelector<MediaContextMenu>('media-context-menu');

    contextmenu(el.querySelector('my-player'));
    assert.isFalse(contextMenu.hidden);
  });

  it('does not open for custom elements without media attributes', async () => {
    const el = await fixture<MediaController>(html`
      <media-controller>
        <video slot="media" muted></video>
        <my-widget></my-widget>
        <media-context-menu></media-context-menu>
      </media-controller>
    `);

    contextmenu(el.querySelector('my-widget'));
    assert.isTrue(
      el.querySelector<MediaContextMenu>('media-context-menu').hidden
    );
  });

  it('closes other open context menus when opening', async () => {
    const other = await fixture<MediaController>(html`
      <media-controller>
        <video slot="media" muted></video>
        <media-context-menu></media-context-menu>
      </media-controller>
    `);
    const otherMenu =
      other.querySelector<MediaContextMenu>('media-context-menu');

    contextmenu(video);
    assert.isFalse(menu.hidden);

    contextmenu(other.querySelector('video'));
    assert.isFalse(otherMenu.hidden);
    assert.isTrue(menu.hidden);
  });
});

describe('<media-context-menu-item>', () => {
  it('is a menu item with context menu styles', async () => {
    const item = await fixture<MediaContextMenuItem>(html`
      <media-context-menu-item><button>Action</button></media-context-menu-item>
    `);

    assert.instanceOf(item, MediaChromeMenuItem);
    assert.equal(item.getAttribute('role'), 'menuitem');
    assert.equal(item.getAttribute('tabindex'), '-1');
    const styles = Array.from(item.shadowRoot.querySelectorAll('style'))
      .map((style) => style.textContent)
      .join('\n');
    assert.include(styles, '::slotted(*)');
    assert.exists(item.shadowRoot.querySelector('slot[name="submenu"]'));
  });
});
