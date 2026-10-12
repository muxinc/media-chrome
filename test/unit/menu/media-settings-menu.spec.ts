import { assert, fixture, html, waitUntil } from '@open-wc/testing';
import '../../../src/js/media-controller.js';
import '../../../src/js/menu/media-settings-menu.js';
import '../../../src/js/menu/media-settings-menu-item.js';
import '../../../src/js/menu/media-settings-menu-button.js';
import '../../../src/js/menu/media-chrome-menu-item.js';
import { MediaChromeMenu } from '../../../src/js/menu/media-chrome-menu.js';
import { MediaChromeMenuItem } from '../../../src/js/menu/media-chrome-menu-item.js';
import { MediaChromeMenuButton } from '../../../src/js/menu/media-chrome-menu-button.js';
import { MediaSettingsMenu } from '../../../src/js/menu/media-settings-menu.js';
import { MediaSettingsMenuItem } from '../../../src/js/menu/media-settings-menu-item.js';
import { MediaSettingsMenuButton } from '../../../src/js/menu/media-settings-menu-button.js';
import { t } from '../../../src/js/utils/i18n.js';
import type { MediaController } from '../../../src/js/media-controller.js';

describe('settings menu', () => {
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

  let controller: MediaController;
  let button: MediaSettingsMenuButton;
  let menu: MediaSettingsMenu;
  let speedItem: MediaSettingsMenuItem;
  let speedMenu: MediaChromeMenu;

  beforeEach(async () => {
    controller = await fixture<MediaController>(html`
      <media-controller style="width: 480px; height: 270px;">
        <media-settings-menu hidden anchor="auto">
          <media-settings-menu-item>
            Speed
            <media-chrome-menu slot="submenu" hidden>
              <span slot="title">Speed</span>
              <media-chrome-menu-item type="radio" value="1"
                >1x</media-chrome-menu-item
              >
              <media-chrome-menu-item type="radio" value="2"
                >2x</media-chrome-menu-item
              >
            </media-chrome-menu>
          </media-settings-menu-item>
        </media-settings-menu>
        <media-control-bar>
          <media-settings-menu-button></media-settings-menu-button>
        </media-control-bar>
      </media-controller>
    `);
    button = controller.querySelector('media-settings-menu-button');
    menu = controller.querySelector('media-settings-menu');
    speedItem = menu.querySelector('media-settings-menu-item');
    speedMenu = speedItem.querySelector('media-chrome-menu');
  });

  describe('<media-settings-menu-button>', () => {
    it('is a labelled menu button', () => {
      assert.instanceOf(button, MediaChromeMenuButton);
      assert.equal(button.getAttribute('aria-label'), t('settings'));
      assert.equal(button.getAttribute('aria-haspopup'), 'menu');
      assert.equal(
        MediaSettingsMenuButton.getTooltipContentHTML(),
        t('Settings')
      );
      assert.include(MediaSettingsMenuButton.observedAttributes, 'target');
      assert.exists(button.shadowRoot.querySelector('slot[name="icon"] svg'));
    });

    it('targets the settings menu of its media controller by default', () => {
      assert.isNull(button.invokeTarget);
      assert.equal(button.invokeTargetElement, menu);
    });

    it('uses an explicit invoke target when set', () => {
      const other = document.createElement('div');
      other.id = 'explicit-settings-target';
      controller.append(other);

      button.invokeTarget = 'explicit-settings-target';
      assert.equal(button.invokeTargetElement, other);
    });

    it('opens and closes the settings menu', () => {
      button.click();
      assert.isFalse(menu.hidden);
      assert.equal(button.getAttribute('aria-expanded'), 'true');

      button.click();
      assert.isTrue(menu.hidden);
      assert.equal(button.getAttribute('aria-expanded'), 'false');
    });
  });

  describe('<media-settings-menu>', () => {
    it('is a media chrome menu with settings styles', () => {
      assert.instanceOf(menu, MediaChromeMenu);
      assert.equal(menu.getAttribute('role'), 'menu');
      const styles = Array.from(menu.shadowRoot.querySelectorAll('style'))
        .map((style) => style.textContent)
        .join('\n');
      assert.include(styles, '--media-settings-menu-min-width');
    });

    it('anchors to the settings menu button with anchor="auto"', () => {
      assert.equal(menu.anchorElement, button);
    });

    it('falls back to anchoring by id otherwise', () => {
      button.id = 'settings-anchor';
      menu.anchor = 'settings-anchor';
      assert.equal(menu.anchorElement, button);

      menu.removeAttribute('anchor');
      assert.isNull(menu.anchorElement);
    });

    it('positions the menu when opened', () => {
      button.click();
      // A toggle event from inside the menu (as fired by a submenu)
      // synchronously repositions it, independent of ResizeObserver timing.
      speedItem.dispatchEvent(new Event('toggle', { bubbles: true }));

      assert.notEqual(menu.style.getPropertyValue('--_menu-max-height'), '');
      assert.equal(getComputedStyle(menu).position, 'absolute');
    });

    it('opens a submenu and resizes to fit it', () => {
      button.click();
      speedItem.click();

      assert.isFalse(speedMenu.hidden);
      assert.equal(speedItem.getAttribute('aria-expanded'), 'true');
      assert.isTrue(menu.container.classList.contains('has-expanded'));
      assert.notEqual(
        menu.style.getPropertyValue('min-width'),
        '',
        'menu should be resized to the submenu'
      );

      const back = speedMenu.shadowRoot.querySelector(
        'button[part~="back"]'
      ) as HTMLButtonElement;
      back.click();
      assert.isTrue(speedMenu.hidden);
      assert.isFalse(menu.container.classList.contains('has-expanded'));
      assert.equal(menu.style.getPropertyValue('min-width'), '');
    });

    it('keeps the settings menu open when selecting in a submenu', () => {
      button.click();
      speedItem.click();
      speedMenu
        .querySelectorAll<MediaChromeMenuItem>('media-chrome-menu-item')[1]
        .click();

      assert.equal(speedMenu.value, '2');
      assert.isFalse(menu.hidden);
    });
  });

  describe('<media-settings-menu-item>', () => {
    it('is a menu item with a chevron suffix', () => {
      assert.instanceOf(speedItem, MediaChromeMenuItem);
      assert.equal(speedItem.getAttribute('role'), 'menuitem');
      assert.equal(speedItem.getAttribute('aria-haspopup'), 'menu');
      const suffix = speedItem.shadowRoot.querySelector('slot[name="suffix"]');
      assert.exists(suffix.querySelector('svg'));
      assert.include(MediaSettingsMenuItem.getSuffixSlotInnerHTML({}), '<svg');
    });

    it('describes the checked submenu item', async () => {
      const description = () =>
        speedItem.shadowRoot.querySelector('slot[name="description"]')
          .textContent;
      await waitUntil(() => description() === '1x');

      speedMenu.value = '2';
      assert.equal(description(), '2x');
    });
  });
});
