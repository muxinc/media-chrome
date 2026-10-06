import { assert, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/js/menu/media-chrome-menu-button.js';
import type { MediaChromeMenuButton } from '../../../src/js/menu/media-chrome-menu-button.js';
import { MediaChromeButton } from '../../../src/js/media-chrome-button.js';

function key(target: EventTarget, type: string, k: string) {
  target.dispatchEvent(new KeyboardEvent(type, { key: k, bubbles: true }));
}

describe('<media-chrome-menu-button>', () => {
  let root: HTMLElement;
  let button: MediaChromeMenuButton;
  let target: HTMLElement;
  let onInvoke: sinon.SinonSpy;

  beforeEach(async () => {
    root = await fixture(html`
      <div>
        <media-chrome-menu-button invoketarget="button-target">
          Menu
        </media-chrome-menu-button>
        <div id="button-target"></div>
      </div>
    `);
    button = root.querySelector('media-chrome-menu-button');
    target = root.querySelector('#button-target');
    onInvoke = spy();
    target.addEventListener('invoke', onInvoke);
  });

  it('is a media chrome button with a menu popup', () => {
    assert.instanceOf(button, MediaChromeButton);
    assert.equal(button.getAttribute('aria-haspopup'), 'menu');
    assert.equal(button.invokeTarget, 'button-target');
    assert.equal(button.invokeTargetElement, target);
  });

  it('dispatches invoke on its target when clicked', () => {
    button.click();

    assert.isTrue(onInvoke.calledOnce);
    const event = onInvoke.firstCall.args[0];
    assert.equal(event.relatedTarget, button);
    assert.equal(event.action, 'auto');
  });

  it('dispatches invoke on Enter keyup', () => {
    key(button, 'keydown', 'Enter');
    key(button, 'keyup', 'Enter');
    assert.isTrue(onInvoke.calledOnce);
  });

  it('can change its invoke target', async () => {
    const other = document.createElement('div');
    other.id = 'other-button-target';
    root.append(other);
    const onOther = spy();
    other.addEventListener('invoke', onOther);

    button.invokeTarget = 'other-button-target';
    assert.equal(button.getAttribute('invoketarget'), 'other-button-target');
    button.click();

    assert.isTrue(onOther.calledOnce);
    assert.isFalse(onInvoke.called);
  });

  it('has no popup and does nothing without an invoke target', async () => {
    const el = await fixture<MediaChromeMenuButton>(html`
      <media-chrome-menu-button>Menu</media-chrome-menu-button>
    `);
    assert.isFalse(el.hasAttribute('aria-haspopup'));
    assert.isNull(el.invokeTargetElement);
    el.click();
  });

  it('does not add a popup when the target does not exist', async () => {
    const el = await fixture<MediaChromeMenuButton>(html`
      <media-chrome-menu-button invoketarget="missing"
        >Menu</media-chrome-menu-button
      >
    `);
    assert.isFalse(el.hasAttribute('aria-haspopup'));
    assert.isNull(el.invokeTargetElement);
  });
});
