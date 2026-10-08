import { aTimeout, assert, fixture, html, waitUntil } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-chrome-menu-button.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import {
  MediaChromeMenu,
  createIndicator,
  createMenuItem,
} from '../../../src/js/menu/media-chrome-menu.js';
import type { MediaChromeMenuItem } from '../../../src/js/menu/media-chrome-menu-item.js';
import type { MediaChromeMenuButton } from '../../../src/js/menu/media-chrome-menu-button.js';
import type { MediaController } from '../../../src/js/media-controller.js';

function keydown(
  target: EventTarget,
  key: string,
  init: KeyboardEventInit = {}
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    composed: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
}

/**
 * A toggle event from inside the menu (as fired by a submenu) synchronously
 * resizes and repositions the menu, so tests don't depend on ResizeObserver
 * timing, which is unreliable in background test pages.
 */
function repositionNow(menu: HTMLElement) {
  menu.firstElementChild.dispatchEvent(new Event('toggle', { bubbles: true }));
}

function getItems(menu: HTMLElement): MediaChromeMenuItem[] {
  return Array.from(menu.querySelectorAll('media-chrome-menu-item'));
}

function checkedStates(menu: HTMLElement): string[] {
  return getItems(menu).map((item) => item.getAttribute('aria-checked'));
}

describe('<media-chrome-menu>', () => {
  // Resizing the menu from its own ResizeObserver callback can make browsers
  // report a benign "ResizeObserver loop" error, which would fail the test.
  let originalOnError: OnErrorEventHandler;
  before(() => {
    originalOnError = window.onerror;
    window.onerror = function (message, ...rest) {
      if (String(message).includes('ResizeObserver loop')) return true;
      return originalOnError?.call(this, message, ...rest);
    };
  });
  after(() => {
    window.onerror = originalOnError;
  });

  describe('radio menu', () => {
    let menu: MediaChromeMenu;

    beforeEach(async () => {
      menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item type="radio" value="a"
            >A</media-chrome-menu-item
          >
          <media-chrome-menu-item type="radio" value="b"
            >B</media-chrome-menu-item
          >
          <media-chrome-menu-item type="radio" value="c"
            >C</media-chrome-menu-item
          >
        </media-chrome-menu>
      `);
    });

    it('sets the menu role and exposes items', () => {
      assert.equal(menu.getAttribute('role'), 'menu');
      assert.lengthOf(menu.items, 3);
      assert.lengthOf(menu.radioGroupItems, 3);
      assert.deepEqual(
        menu.items.map((item) => item.getAttribute('role')),
        ['menuitemradio', 'menuitemradio', 'menuitemradio']
      );
    });

    it('checks the first radio item when none is checked', () => {
      assert.deepEqual(checkedStates(menu), ['true', 'false', 'false']);
      assert.equal(menu.value, 'a');
      assert.deepEqual(menu.checkedItems, [menu.items[0]]);
    });

    it('selects an item by value and fires change', () => {
      const onChange = spy();
      menu.addEventListener('change', onChange);

      menu.value = 'c';

      assert.equal(menu.value, 'c');
      assert.deepEqual(checkedStates(menu), ['false', 'false', 'true']);
      assert.isTrue(onChange.calledOnce);
    });

    it('does not fire change when setting the current value', () => {
      const onChange = spy();
      menu.addEventListener('change', onChange);

      menu.value = 'a';

      assert.isFalse(onChange.called);
      assert.equal(menu.value, 'a');
    });

    it('ignores unknown values', () => {
      const onChange = spy();
      menu.addEventListener('change', onChange);

      menu.value = 'nope';

      assert.isFalse(onChange.called);
      assert.equal(menu.value, 'a');
    });

    it('selects a radio item on click and unchecks the others', () => {
      const onChange = spy();
      menu.addEventListener('change', onChange);

      getItems(menu)[1].click();

      assert.deepEqual(checkedStates(menu), ['false', 'true', 'false']);
      assert.equal(menu.value, 'b');
      assert.isTrue(onChange.calledOnce);
      assert.equal(menu.items[1].tabIndex, 0);
      assert.equal(menu.items[0].tabIndex, -1);
    });

    it('ignores clicks on disabled items', () => {
      const onChange = spy();
      menu.addEventListener('change', onChange);
      const item = getItems(menu)[2];
      item.setAttribute('disabled', '');

      item.click();

      assert.isFalse(onChange.called);
      assert.equal(menu.value, 'a');
    });

    it('ignores clicks that are not on an item', () => {
      const onChange = spy();
      menu.addEventListener('change', onChange);

      menu.click();

      assert.isFalse(onChange.called);
    });

    it('moves focus with arrow keys, Home and End and wraps around', () => {
      const [a, b, c] = getItems(menu);

      keydown(a, 'ArrowDown');
      assert.equal(document.activeElement, b);
      assert.equal(b.tabIndex, 0);
      assert.equal(a.tabIndex, -1);

      keydown(b, 'ArrowDown');
      assert.equal(document.activeElement, c);

      keydown(c, 'ArrowDown');
      assert.equal(document.activeElement, a, 'wraps to the first item');

      keydown(a, 'ArrowUp');
      assert.equal(document.activeElement, c, 'wraps to the last item');

      keydown(c, 'Home');
      assert.equal(document.activeElement, a);

      keydown(a, 'End');
      assert.equal(document.activeElement, c);
    });

    it('uses the tab item when the key event does not come from an item', () => {
      const [, b, c] = getItems(menu);
      b.tabIndex = 0;

      keydown(menu, 'ArrowDown');

      assert.equal(document.activeElement, c);
    });

    it('selects the item with Enter and Space', () => {
      const [, b, c] = getItems(menu);

      const enter = keydown(b, 'Enter');
      assert.isTrue(enter.defaultPrevented);
      assert.equal(menu.value, 'b');

      keydown(c, ' ');
      assert.equal(menu.value, 'c');
    });

    it('ignores keys with modifiers and unused keys', () => {
      const [a] = getItems(menu);

      const withCtrl = keydown(a, 'ArrowDown', { ctrlKey: true });
      const withAlt = keydown(a, 'Enter', { altKey: true });
      const unused = keydown(a, 'x');

      assert.isFalse(withCtrl.defaultPrevented);
      assert.isFalse(withAlt.defaultPrevented);
      assert.isFalse(unused.defaultPrevented);
      assert.notEqual(document.activeElement, getItems(menu)[1]);
      assert.equal(menu.value, 'a');
    });

    it('stops handling clicks when disabled and resumes when re-enabled', () => {
      const [, b, c] = getItems(menu);

      menu.setAttribute('disabled', '');
      b.click();
      assert.equal(menu.value, 'a');

      menu.removeAttribute('disabled');
      c.click();
      assert.equal(menu.value, 'c');
    });

    it('focus() focuses the first item and makes it tabbable', () => {
      menu.focus();

      assert.equal(document.activeElement, menu.items[0]);
      assert.equal(menu.items[0].tabIndex, 0);
      assert.equal(menu.items[1].tabIndex, -1);
    });

    it('hides the menu on Escape once it is used as a popover', () => {
      // Any change of the hidden attribute turns the menu into a popover.
      menu.hidden = true;
      menu.hidden = false;

      keydown(getItems(menu)[0], 'Escape');

      assert.isTrue(menu.hidden);
    });

    it('does not hide an inline menu on Escape', () => {
      keydown(getItems(menu)[0], 'Escape');
      assert.isFalse(menu.hidden);
    });

    it('closes a popover menu when tabbing out', () => {
      menu.hidden = true;
      menu.hidden = false;

      const event = keydown(getItems(menu)[0], 'Tab');

      assert.isTrue(event.defaultPrevented);
      assert.isTrue(menu.hidden);
    });
  });

  describe('inline menu Tab navigation', () => {
    it('moves focus to the next and previous siblings', async () => {
      const el = await fixture(html`
        <div>
          <button id="before">before</button>
          <media-chrome-menu>
            <media-chrome-menu-item type="radio">A</media-chrome-menu-item>
          </media-chrome-menu>
          <button id="after">after</button>
        </div>
      `);
      const menu = el.querySelector('media-chrome-menu') as MediaChromeMenu;
      const item = menu.querySelector('media-chrome-menu-item');

      keydown(item, 'Tab');
      assert.equal(document.activeElement, el.querySelector('#after'));

      keydown(item, 'Tab', { shiftKey: true });
      assert.equal(document.activeElement, el.querySelector('#before'));

      assert.isFalse(menu.hidden);
    });
  });

  describe('checkbox menu', () => {
    it('toggles checkbox items without affecting others', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item type="checkbox" value="x"
            >X</media-chrome-menu-item
          >
          <media-chrome-menu-item type="checkbox" value="y"
            >Y</media-chrome-menu-item
          >
        </media-chrome-menu>
      `);
      const [x, y] = getItems(menu);
      const onChange = spy();
      menu.addEventListener('change', onChange);

      assert.equal(x.getAttribute('role'), 'menuitemcheckbox');
      assert.deepEqual(checkedStates(menu), ['false', 'false']);
      assert.lengthOf(menu.radioGroupItems, 0);
      assert.equal(menu.value, '');

      x.click();
      y.click();
      assert.deepEqual(checkedStates(menu), ['true', 'true']);
      assert.deepEqual(
        menu.checkedItems.map((item) => item.value),
        ['x', 'y']
      );
      assert.equal(onChange.callCount, 2);

      x.click();
      assert.deepEqual(checkedStates(menu), ['false', 'true']);
      assert.equal(menu.value, 'y');
    });
  });

  describe('preselected items', () => {
    it('keeps the item with a checked attribute selected', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item type="radio" value="a"
            >A</media-chrome-menu-item
          >
          <media-chrome-menu-item type="radio" value="b" checked
            >B</media-chrome-menu-item
          >
        </media-chrome-menu>
      `);

      assert.equal(menu.value, 'b');
      assert.deepEqual(checkedStates(menu), ['false', 'true']);
    });

    it('keeps a custom role set before connecting', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu role="listbox"></media-chrome-menu>
      `);
      assert.equal(menu.getAttribute('role'), 'listbox');
    });
  });

  describe('invoking with a menu button', () => {
    let root: HTMLElement;
    let button: MediaChromeMenuButton;
    let menu: MediaChromeMenu;

    beforeEach(async () => {
      root = await fixture(html`
        <div>
          <media-chrome-menu-button invoketarget="invoked-menu">
            Open
          </media-chrome-menu-button>
          <media-chrome-menu id="invoked-menu" hidden>
            <media-chrome-menu-item type="radio" value="a"
              >A</media-chrome-menu-item
            >
            <media-chrome-menu-item type="radio" value="b"
              >B</media-chrome-menu-item
            >
          </media-chrome-menu>
        </div>
      `);
      button = root.querySelector('media-chrome-menu-button');
      menu = root.querySelector('media-chrome-menu');
    });

    it('toggles the menu and aria-expanded on the invoker', () => {
      const onToggle = spy();
      menu.addEventListener('toggle', onToggle);

      button.click();
      assert.isFalse(menu.hidden);
      assert.equal(button.getAttribute('aria-expanded'), 'true');
      assert.equal(onToggle.lastCall.args[0].newState, 'open');
      assert.equal(onToggle.lastCall.args[0].oldState, 'closed');

      button.click();
      assert.isTrue(menu.hidden);
      assert.equal(button.getAttribute('aria-expanded'), 'false');
      assert.equal(onToggle.lastCall.args[0].newState, 'closed');
    });

    it('focuses the first item when the open transition ends', () => {
      button.click();
      menu.dispatchEvent(new Event('transitionend'));
      assert.equal(document.activeElement, menu.items[0]);
    });

    it('closes after selecting an item', () => {
      button.click();
      getItems(menu)[1].click();

      assert.equal(menu.value, 'b');
      assert.isTrue(menu.hidden);
      assert.equal(button.getAttribute('aria-expanded'), 'false');
    });

    it('closes when focus moves outside of the menu', () => {
      button.click();
      getItems(menu)[0].dispatchEvent(
        new FocusEvent('focusout', {
          bubbles: true,
          composed: true,
          relatedTarget: document.body,
        })
      );
      assert.isTrue(menu.hidden);
    });

    it('stays open when focus moves to the invoker or within the menu', () => {
      button.click();
      const [a, b] = getItems(menu);

      a.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: b })
      );
      assert.isFalse(menu.hidden);

      a.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: button })
      );
      assert.isFalse(menu.hidden);
    });

    it('ignores invoke events coming from inside the menu', async () => {
      const { InvokeEvent } = await import('../../../src/js/utils/events.js');
      menu.dispatchEvent(new InvokeEvent({ relatedTarget: menu.items[0] }));
      assert.isTrue(menu.hidden);
    });
  });

  describe('header', () => {
    it('is hidden without a title and shown with one', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu></media-chrome-menu>
      `);
      const header = menu.shadowRoot.querySelector(
        'slot[name="header"]'
      ) as HTMLSlotElement;
      assert.isTrue(header.hidden);

      const title = document.createElement('span');
      title.slot = 'title';
      title.textContent = 'Quality';
      menu.append(title);

      await waitUntil(() => !header.hidden, 'header should be shown');
    });

    it('back button closes the menu', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <span slot="title">Title</span>
          <media-chrome-menu-item type="radio">A</media-chrome-menu-item>
        </media-chrome-menu>
      `);
      const back = menu.shadowRoot.querySelector(
        'button[part~="back"]'
      ) as HTMLButtonElement;

      back.click();

      assert.isTrue(menu.hidden);
    });
  });

  describe('dynamic items', () => {
    it('fires addmenuitem and removemenuitem', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item type="radio">A</media-chrome-menu-item>
        </media-chrome-menu>
      `);
      // Wait for the initial slotchange to record the existing items.
      await waitUntil(() => menu.items.length === 1);
      await aTimeout(0);

      const added: Element[] = [];
      const removed: Element[] = [];
      menu.addEventListener('addmenuitem', (e: CustomEvent) =>
        added.push(e.detail)
      );
      menu.addEventListener('removemenuitem', (e: CustomEvent) =>
        removed.push(e.detail)
      );

      const item = createMenuItem({
        type: 'radio',
        text: 'B',
        value: 'b',
        checked: false,
      });
      menu.append(item);
      await waitUntil(() => added.length === 1, 'addmenuitem not fired');
      assert.equal(added[0], item);
      assert.lengthOf(removed, 0);

      item.remove();
      await waitUntil(() => removed.length === 1, 'removemenuitem not fired');
      assert.equal(removed[0], item);
    });
  });

  describe('submenus', () => {
    let menu: MediaChromeMenu;
    let qualityItem: MediaChromeMenuItem;
    let speedItem: MediaChromeMenuItem;
    let qualityMenu: MediaChromeMenu;
    let speedMenu: MediaChromeMenu;

    beforeEach(async () => {
      menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item id="quality-item">
            <span>Quality</span>
            <media-chrome-menu slot="submenu" hidden>
              <span slot="title">Quality</span>
              <media-chrome-menu-item type="radio" value="hd"
                >HD</media-chrome-menu-item
              >
              <media-chrome-menu-item
                type="radio"
                value="sd"
                data-description="Low"
                >SD</media-chrome-menu-item
              >
            </media-chrome-menu>
          </media-chrome-menu-item>
          <media-chrome-menu-item id="speed-item">
            <span>Speed</span>
            <media-chrome-menu slot="submenu" hidden>
              <media-chrome-menu-item type="radio" value="1"
                >1x</media-chrome-menu-item
              >
              <media-chrome-menu-item type="radio" value="2"
                >2x</media-chrome-menu-item
              >
            </media-chrome-menu>
          </media-chrome-menu-item>
        </media-chrome-menu>
      `);
      qualityItem = menu.querySelector('#quality-item');
      speedItem = menu.querySelector('#speed-item');
      qualityMenu = qualityItem.querySelector('media-chrome-menu');
      speedMenu = speedItem.querySelector('media-chrome-menu');
    });

    function description(item: MediaChromeMenuItem) {
      return item.shadowRoot.querySelector('slot[name="description"]')
        .textContent;
    }

    it('marks items with a submenu as popup triggers', () => {
      assert.equal(qualityItem.getAttribute('role'), 'menuitem');
      assert.equal(qualityItem.getAttribute('aria-haspopup'), 'menu');
      assert.equal(qualityItem.getAttribute('aria-expanded'), 'false');
      assert.equal(qualityItem.submenuElement, qualityMenu);
      assert.equal(qualityItem.invokeTargetElement, qualityMenu);
      assert.equal(qualityItem.getAttribute('submenusize'), '2');
    });

    it('describes the checked submenu item', async () => {
      await waitUntil(() => description(qualityItem) === 'HD');

      qualityMenu.value = 'sd';
      assert.equal(description(qualityItem), 'Low', 'uses data-description');
    });

    it('opens a submenu on click and expands the parent container', () => {
      qualityItem.click();

      assert.isFalse(qualityMenu.hidden);
      assert.equal(qualityItem.getAttribute('aria-expanded'), 'true');
      assert.isTrue(menu.container.classList.contains('has-expanded'));
    });

    it('closes the other open submenu when opening a new one', () => {
      qualityItem.click();
      speedItem.click();

      assert.isTrue(qualityMenu.hidden);
      assert.isFalse(speedMenu.hidden);
      assert.equal(qualityItem.getAttribute('aria-expanded'), 'false');
      assert.equal(speedItem.getAttribute('aria-expanded'), 'true');
      assert.isTrue(menu.container.classList.contains('has-expanded'));
    });

    it('collapses the parent when the submenu back button is used', () => {
      qualityItem.click();
      const back = qualityMenu.shadowRoot.querySelector(
        'button[part~="back"]'
      ) as HTMLButtonElement;

      back.click();

      assert.isTrue(qualityMenu.hidden);
      assert.equal(qualityItem.getAttribute('aria-expanded'), 'false');
      assert.isFalse(menu.container.classList.contains('has-expanded'));
    });

    it('selecting in a submenu does not change the parent value', () => {
      qualityItem.click();
      getItems(qualityMenu)[1].click();

      assert.equal(qualityMenu.value, 'sd');
      assert.equal(menu.value, '');
    });
  });

  describe('anchoring', () => {
    it('resolves the anchor element by id', async () => {
      const el = await fixture(html`
        <div>
          <button id="menu-anchor">anchor</button>
          <media-chrome-menu anchor="menu-anchor"></media-chrome-menu>
          <media-chrome-menu id="unanchored"></media-chrome-menu>
        </div>
      `);
      const menu = el.querySelector('media-chrome-menu') as MediaChromeMenu;
      const unanchored = el.querySelector('#unanchored') as MediaChromeMenu;

      assert.equal(menu.anchor, 'menu-anchor');
      assert.equal(menu.anchorElement, el.querySelector('#menu-anchor'));
      assert.isNull(unanchored.anchorElement);

      unanchored.anchor = 'menu-anchor';
      assert.equal(unanchored.getAttribute('anchor'), 'menu-anchor');
      assert.equal(unanchored.anchorElement, el.querySelector('#menu-anchor'));
    });

    it('positions an open anchored menu within its bounds', async () => {
      const el = await fixture(html`
        <div
          id="menu-bounds"
          style="position: relative; width: 400px; height: 300px;"
        >
          <div>
            <media-chrome-menu anchor="pos-anchor" bounds="menu-bounds" hidden>
              <media-chrome-menu-item type="radio">A</media-chrome-menu-item>
            </media-chrome-menu>
          </div>
          <button
            id="pos-anchor"
            style="position: absolute; left: 20px; bottom: 10px;"
          >
            anchor
          </button>
        </div>
      `);
      const menu = el.querySelector('media-chrome-menu') as MediaChromeMenu;

      menu.hidden = false;
      repositionNow(menu);

      assert.equal(getComputedStyle(menu).position, 'absolute');
      assert.isAbove(
        parseFloat(menu.style.getPropertyValue('--_menu-max-height')),
        0
      );
    });

    it('does not position a menu with a mediacontroller attribute and no anchor', async () => {
      const el = await fixture(html`
        <div style="position: relative; width: 400px; height: 300px;">
          <media-controller id="pos-controller"></media-controller>
          <media-chrome-menu mediacontroller="pos-controller" hidden>
            <media-chrome-menu-item type="radio">A</media-chrome-menu-item>
          </media-chrome-menu>
        </div>
      `);
      const menu = el.querySelector('media-chrome-menu') as MediaChromeMenu;
      menu.hidden = false;
      repositionNow(menu);

      assert.equal(menu.style.getPropertyValue('--_menu-max-height'), '');
    });
  });

  describe('media controller association', () => {
    it('associates with and unassociates from the controller', async () => {
      const el = await fixture(html`
        <div>
          <media-controller id="assoc-controller"></media-controller>
          <media-chrome-menu></media-chrome-menu>
        </div>
      `);
      const controller = el.querySelector(
        'media-controller'
      ) as MediaController;
      const menu = el.querySelector('media-chrome-menu') as MediaChromeMenu;
      const associate = spy(controller, 'associateElement');
      const unassociate = spy(controller, 'unassociateElement');

      menu.setAttribute('mediacontroller', 'assoc-controller');
      assert.isTrue(associate.calledWith(menu));

      menu.removeAttribute('mediacontroller');
      assert.isTrue(unassociate.calledWith(menu));

      menu.setAttribute('mediacontroller', 'assoc-controller');
      unassociate.resetHistory();
      menu.remove();
      assert.isTrue(unassociate.calledWith(menu), 'on disconnect');
    });
  });

  describe('layout', () => {
    it('enables the row layout via --media-menu-layout', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu></media-chrome-menu>
      `);
      const layoutRow = menu.shadowRoot.querySelector('#layout-row');
      assert.equal(layoutRow.getAttribute('media'), 'width:0');

      menu.setAttribute('style', '--media-menu-layout: row');
      assert.equal(layoutRow.getAttribute('media'), '');

      menu.setAttribute('style', '--media-menu-layout: column');
      assert.equal(layoutRow.getAttribute('media'), 'width:0');
    });
  });

  describe('focus without items', () => {
    it('focuses the first focusable child', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <div>text</div>
          <button tabindex="0">focusable</button>
        </media-chrome-menu>
      `);
      menu.focus();
      assert.equal(document.activeElement, menu.querySelector('button'));
    });
  });

  describe('helpers', () => {
    it('formatMenuItemText returns the text by default', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu></media-chrome-menu>
      `);
      assert.equal(menu.formatMenuItemText('Hello', { a: 1 }), 'Hello');
      assert.equal(MediaChromeMenu.formatMenuItemText('Hi'), 'Hi');
    });

    it('createMenuItem builds a configured item', () => {
      const item = createMenuItem({
        type: 'checkbox',
        text: 'Label',
        value: 'val',
        checked: true,
      });

      assert.equal(item.localName, 'media-chrome-menu-item');
      assert.equal(item.type, 'checkbox');
      assert.equal(item.value, 'val');
      assert.isTrue(item.checked);
      assert.isTrue(item.part.contains('menu-item'));
      assert.isTrue(item.part.contains('checkbox'));
      assert.equal(item.textContent, 'Label');
    });

    it('createMenuItem without a type creates a plain item', () => {
      const item = createMenuItem({ text: 'Plain', value: 'p', checked: true });
      assert.equal(item.type, '');
      assert.isUndefined(item.checked);
      assert.isFalse(item.part.contains('checked'));
    });

    it('createIndicator clones a slotted custom indicator', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <span slot="checked-indicator" class="custom">*</span>
        </media-chrome-menu>
      `);
      const indicator = createIndicator(menu, 'checked-indicator') as Element;
      assert.equal(indicator.className, 'custom');
      assert.notEqual(indicator, menu.querySelector('.custom'));
    });

    it('createIndicator follows chained slots', async () => {
      const host = await fixture(html`<div></div>`);
      host.attachShadow({ mode: 'open' }).innerHTML = `
        <media-chrome-menu>
          <slot name="checked-indicator" slot="checked-indicator"></slot>
        </media-chrome-menu>
      `;
      const custom = document.createElement('b');
      custom.slot = 'checked-indicator';
      custom.className = 'chained';
      host.append(custom);

      const menu = host.shadowRoot.querySelector('media-chrome-menu');
      const indicator = createIndicator(menu, 'checked-indicator') as Element;
      assert.equal(indicator.className, 'chained');
    });

    it('createIndicator falls back to the shadow svg or an empty string', async () => {
      const menu = await fixture<MediaChromeMenu>(html`
        <media-chrome-menu>
          <media-chrome-menu-item type="radio">A</media-chrome-menu-item>
        </media-chrome-menu>
      `);
      const item = menu.querySelector('media-chrome-menu-item');

      const svg = createIndicator(item, 'checked-indicator') as Element;
      assert.equal(svg.localName, 'svg');
      assert.include(svg.getAttribute('part'), 'checked-indicator');

      assert.equal(createIndicator(menu, 'checked-indicator'), '');
    });
  });
});
