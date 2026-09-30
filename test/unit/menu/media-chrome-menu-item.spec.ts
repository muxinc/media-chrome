import { assert, fixture, html, waitUntil } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/js/menu/media-chrome-menu.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import { MediaChromeMenuItem } from '../../../src/js/menu/media-chrome-menu-item.js';
import type { MediaChromeMenu } from '../../../src/js/menu/media-chrome-menu.js';

function key(target: EventTarget, type: string, k: string, init = {}) {
  target.dispatchEvent(
    new KeyboardEvent(type, { key: k, bubbles: true, ...init })
  );
}

describe('<media-chrome-menu-item>', () => {
  describe('standalone', () => {
    let item: MediaChromeMenuItem;

    beforeEach(async () => {
      item = await fixture<MediaChromeMenuItem>(html`
        <media-chrome-menu-item> Label </media-chrome-menu-item>
      `);
    });

    it('is a focusable plain menuitem', () => {
      assert.instanceOf(item, MediaChromeMenuItem);
      assert.equal(item.getAttribute('role'), 'menuitem');
      assert.equal(item.getAttribute('tabindex'), '-1');
      assert.isFalse(item.hasAttribute('aria-checked'));
      assert.equal(item.type, '');
    });

    it('uses its trimmed text as the default value', () => {
      assert.equal(item.text, 'Label');
      assert.equal(item.value, 'Label');

      item.value = 'custom';
      assert.equal(item.getAttribute('value'), 'custom');
      assert.equal(item.value, 'custom');
    });

    it('is not checkable without a checkable type', () => {
      assert.isUndefined(item.checked);
      item.checked = true;
      assert.isFalse(item.hasAttribute('aria-checked'));
      assert.isFalse(item.part.contains('checked'));

      item.setAttribute('checked', '');
      assert.isFalse(item.hasAttribute('aria-checked'));
    });

    it('updates its role when the type changes', () => {
      item.type = 'radio';
      assert.equal(item.getAttribute('role'), 'menuitemradio');

      item.type = 'checkbox';
      assert.equal(item.getAttribute('role'), 'menuitemcheckbox');
    });

    it('removes and restores tabindex when disabled and enabled', () => {
      item.setAttribute('disabled', '');
      assert.isFalse(item.hasAttribute('tabindex'));

      item.removeAttribute('disabled');
      assert.equal(item.getAttribute('tabindex'), '-1');
    });

    it('keeps an explicit tabindex', async () => {
      const el = await fixture<MediaChromeMenuItem>(html`
        <media-chrome-menu-item tabindex="0">A</media-chrome-menu-item>
      `);
      assert.equal(el.getAttribute('tabindex'), '0');
    });

    it('renders an empty suffix slot by default', () => {
      assert.equal(MediaChromeMenuItem.getSuffixSlotInnerHTML({}), '');
      const suffix = item.shadowRoot.querySelector('slot[name="suffix"]');
      assert.equal(suffix.children.length, 0);
    });

    it('does not throw on click without an invoke target', () => {
      assert.notExists(item.invokeTargetElement);
      item.click();
    });
  });

  describe('checked state', () => {
    it('reflects the checked attribute until checked is set directly', async () => {
      const item = await fixture<MediaChromeMenuItem>(html`
        <media-chrome-menu-item type="checkbox" checked
          >A</media-chrome-menu-item
        >
      `);
      assert.equal(item.getAttribute('aria-checked'), 'true');
      assert.isTrue(item.checked);

      item.removeAttribute('checked');
      assert.isFalse(item.checked);

      item.checked = true;
      assert.isTrue(item.checked);
      assert.isTrue(item.part.contains('checked'));

      // Once dirty, the checked attribute no longer drives the state.
      item.removeAttribute('checked');
      assert.isTrue(item.checked);

      item.checked = false;
      assert.isFalse(item.checked);
      assert.isFalse(item.part.contains('checked'));
    });

    it('defaults checkable items to aria-checked="false"', async () => {
      const item = await fixture<MediaChromeMenuItem>(html`
        <media-chrome-menu-item type="radio">A</media-chrome-menu-item>
      `);
      assert.equal(item.getAttribute('aria-checked'), 'false');
      assert.isFalse(item.checked);
    });

    it('resets a radio group to the last checked item on connect', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item type="radio" aria-checked="true"
            >A</media-chrome-menu-item
          >
          <media-chrome-menu-item type="radio" aria-checked="true"
            >B</media-chrome-menu-item
          >
          <media-chrome-menu-item type="radio">C</media-chrome-menu-item>
        </media-chrome-menu>
      `);
      assert.deepEqual(
        menu.items.map((i) => i.getAttribute('aria-checked')),
        ['false', 'true', 'false']
      );
    });
  });

  describe('invoke target', () => {
    let root: HTMLElement;
    let item: MediaChromeMenuItem;
    let target: HTMLElement;
    let onInvoke: sinon.SinonSpy;

    beforeEach(async () => {
      root = await fixture(html`
        <div>
          <media-chrome-menu-item invoketarget="item-target">
            <span>Open</span>
          </media-chrome-menu-item>
          <div id="item-target"></div>
        </div>
      `);
      item = root.querySelector('media-chrome-menu-item');
      target = root.querySelector('#item-target');
      onInvoke = spy();
      target.addEventListener('invoke', onInvoke);
    });

    it('resolves the invoke target by id', () => {
      assert.equal(item.invokeTarget, 'item-target');
      assert.equal(item.invokeTargetElement, target);

      item.invokeTarget = 'other';
      assert.equal(item.getAttribute('invoketarget'), 'other');
      assert.isNull(item.invokeTargetElement);
    });

    it('dispatches invoke on the target when clicked', () => {
      item.querySelector('span').click();

      assert.isTrue(onInvoke.calledOnce);
      assert.equal(onInvoke.firstCall.args[0].relatedTarget, item);
    });

    it('dispatches invoke on Enter and Space keyup', () => {
      key(item, 'keydown', 'Enter');
      assert.isFalse(onInvoke.called, 'waits for keyup');
      key(item, 'keyup', 'Enter');
      assert.equal(onInvoke.callCount, 1);

      key(item, 'keydown', ' ');
      key(item, 'keyup', ' ');
      assert.equal(onInvoke.callCount, 2);
    });

    it('ignores other keys and modified keys', () => {
      key(item, 'keydown', 'a');
      key(item, 'keyup', 'a');

      key(item, 'keydown', 'Enter', { metaKey: true });
      key(item, 'keyup', 'Enter');

      key(item, 'keydown', 'Enter', { altKey: true });
      key(item, 'keyup', 'Enter');

      assert.isFalse(onInvoke.called);
    });

    it('does not invoke when the keyup is for a different key', () => {
      key(item, 'keydown', 'Enter');
      key(item, 'keyup', 'Escape');
      key(item, 'keyup', 'Enter');
      assert.isFalse(onInvoke.called);
    });

    it('does not invoke when disabled', () => {
      item.setAttribute('disabled', '');
      item.click();
      key(item, 'keydown', 'Enter');
      key(item, 'keyup', 'Enter');
      assert.isFalse(onInvoke.called);
    });

    it('does not invoke from checkable items', () => {
      item.type = 'radio';
      item.click();
      assert.isFalse(onInvoke.called);
    });
  });

  describe('submenu', () => {
    it('tracks submenu items and the checked description', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item>
            Speed
            <media-chrome-menu slot="submenu" hidden>
              <media-chrome-menu-item type="radio" value="1"
                >1x</media-chrome-menu-item
              >
            </media-chrome-menu>
          </media-chrome-menu-item>
        </media-chrome-menu>
      `);
      const item = menu.querySelector('media-chrome-menu-item');
      const submenu = item.querySelector<MediaChromeMenu>('media-chrome-menu');
      const description = () =>
        item.shadowRoot.querySelector('slot[name="description"]').textContent;

      assert.equal(item.getAttribute('aria-haspopup'), 'menu');
      await waitUntil(() => description() === '1x');

      const extra = document.createElement(
        'media-chrome-menu-item'
      ) as MediaChromeMenuItem;
      extra.type = 'radio';
      extra.value = '2';
      extra.textContent = '2x';
      submenu.append(extra);

      await waitUntil(
        () => item.getAttribute('submenusize') === '2',
        'submenusize should update when an item is added'
      );

      submenu.value = '2';
      assert.equal(description(), '2x');
    });

    it('removes whitespace-only text from the default slot', async () => {
      const item = await fixture<MediaChromeMenuItem>(html`
        <media-chrome-menu-item> </media-chrome-menu-item>
      `);
      await waitUntil(() => item.childNodes.length === 0);
    });
  });
});
