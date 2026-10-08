import { assert, fixture, nextFrame } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaChromeDialog } from '../../src/js/media-chrome-dialog.js';
import { InvokeEvent } from '../../src/js/utils/events.js';

const keydown = (target: EventTarget, init: KeyboardEventInit) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    composed: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(evt);
  return evt;
};

describe('<media-chrome-dialog>', () => {
  it('renders a shadow root with a content slot and a dialog role', async () => {
    const el = await fixture<MediaChromeDialog>(
      `<media-chrome-dialog></media-chrome-dialog>`
    );
    assert.exists(el.shadowRoot);
    assert.exists(el.shadowRoot.querySelector('slot#content'));
    assert.equal(el.getAttribute('role'), 'dialog');
  });

  it('keeps an existing role', async () => {
    const el = await fixture<MediaChromeDialog>(
      `<media-chrome-dialog role="alertdialog"></media-chrome-dialog>`
    );
    assert.equal(el.getAttribute('role'), 'alertdialog');
  });

  it('sets the hide transition after init', async () => {
    const el = await fixture<MediaChromeDialog>(
      `<media-chrome-dialog></media-chrome-dialog>`
    );
    await nextFrame();
    const sheet = el.shadowRoot.querySelector('style').sheet;
    const hostRule = Array.from(sheet.cssRules).find(
      (rule) => (rule as CSSStyleRule).selectorText === ':host'
    ) as CSSStyleRule;
    // Check a longhand; shorthand serialization differs across browsers.
    assert.include(hostRule.style.transitionDuration, '0.15s');
  });

  it('reflects the open property and dispatches open / close events', async () => {
    const el = await fixture<MediaChromeDialog>(
      `<media-chrome-dialog></media-chrome-dialog>`
    );
    const onOpen = spy();
    const onClose = spy();
    el.addEventListener('open', onOpen);
    el.addEventListener('close', onClose);

    assert.isFalse(el.open);
    el.open = true;
    assert.isTrue(el.hasAttribute('open'));
    assert.isTrue(el.open);
    assert(onOpen.calledOnce, 'open event dispatched');

    el.open = false;
    assert.isFalse(el.hasAttribute('open'));
    assert(onClose.calledOnce, 'close event dispatched');
  });

  it('focuses the autofocus child once the open transition ends', async () => {
    const el = await fixture<MediaChromeDialog>(`
      <media-chrome-dialog>
        <button>first</button>
        <button autofocus>second</button>
      </media-chrome-dialog>
    `);
    const second = el.querySelectorAll('button')[1];
    const onFocus = spy();
    const onFocusIn = spy();
    el.addEventListener('focus', onFocus);
    el.addEventListener('focusin', onFocusIn);

    el.open = true;
    el.dispatchEvent(new Event('transitionend'));

    assert(onFocus.called, 'focus event dispatched');
    assert(onFocusIn.called, 'focusin event dispatched');
    assert.equal(document.activeElement, second);
  });

  it('does not move focus when the focus event is cancelled', async () => {
    const el = await fixture<MediaChromeDialog>(`
      <media-chrome-dialog>
        <button tabindex="0">btn</button>
      </media-chrome-dialog>
    `);
    const button = el.querySelector('button');
    el.addEventListener('focus', (e) => e.preventDefault());
    el.focus();
    assert.notEqual(document.activeElement, button);
  });

  it('does not move focus when the focusin event is cancelled', async () => {
    const el = await fixture<MediaChromeDialog>(`
      <media-chrome-dialog>
        <button tabindex="0">btn</button>
      </media-chrome-dialog>
    `);
    const button = el.querySelector('button');
    el.addEventListener('focusin', (e) => e.preventDefault());
    el.focus();
    assert.notEqual(document.activeElement, button);
  });

  it('toggles on invoke from an external invoker and updates aria-expanded', async () => {
    const container = await fixture<HTMLDivElement>(`
      <div>
        <button id="invoker">open</button>
        <media-chrome-dialog></media-chrome-dialog>
      </div>
    `);
    const invoker = container.querySelector('#invoker') as HTMLElement;
    const el = container.querySelector(
      'media-chrome-dialog'
    ) as MediaChromeDialog;

    el.dispatchEvent(new InvokeEvent({ relatedTarget: invoker }));
    assert.isTrue(el.open);
    assert.equal(invoker.getAttribute('aria-expanded'), 'true');

    el.dispatchEvent(new InvokeEvent({ relatedTarget: invoker }));
    assert.isFalse(el.open);
    assert.equal(invoker.getAttribute('aria-expanded'), 'false');
  });

  it('does not toggle on invoke from an element inside the dialog', async () => {
    const el = await fixture<MediaChromeDialog>(`
      <media-chrome-dialog><button>inside</button></media-chrome-dialog>
    `);
    el.dispatchEvent(
      new InvokeEvent({ relatedTarget: el.querySelector('button') })
    );
    assert.isFalse(el.open);
  });

  it('closes on focusout to an outside element after being invoked', async () => {
    const container = await fixture<HTMLDivElement>(`
      <div>
        <button id="invoker">open</button>
        <button id="outside">outside</button>
        <media-chrome-dialog><button>inside</button></media-chrome-dialog>
      </div>
    `);
    const invoker = container.querySelector('#invoker') as HTMLElement;
    const outside = container.querySelector('#outside') as HTMLElement;
    const el = container.querySelector(
      'media-chrome-dialog'
    ) as MediaChromeDialog;

    el.dispatchEvent(new InvokeEvent({ relatedTarget: invoker }));
    assert.isTrue(el.open);

    // Focusing to something inside keeps it open.
    el.dispatchEvent(
      new FocusEvent('focusout', { relatedTarget: el.querySelector('button') })
    );
    assert.isTrue(el.open);

    // Focusing back to the invoker keeps it open (the invoker toggles it).
    el.dispatchEvent(new FocusEvent('focusout', { relatedTarget: invoker }));
    assert.isTrue(el.open);

    el.dispatchEvent(new FocusEvent('focusout', { relatedTarget: outside }));
    assert.isFalse(el.open);
  });

  it('restores previously focused element on focusout', async () => {
    const container = await fixture<HTMLDivElement>(`
      <div>
        <button id="before">before</button>
        <media-chrome-dialog open><button tabindex="0">inside</button></media-chrome-dialog>
      </div>
    `);
    const before = container.querySelector('#before') as HTMLElement;
    const el = container.querySelector(
      'media-chrome-dialog'
    ) as MediaChromeDialog;

    before.focus();
    el.focus();
    assert.equal(document.activeElement, el.querySelector('button'));

    el.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    assert.equal(document.activeElement, before);
  });

  it('closes on Escape and restores focus', async () => {
    const container = await fixture<HTMLDivElement>(`
      <div>
        <button id="before">before</button>
        <media-chrome-dialog open><button tabindex="0">inside</button></media-chrome-dialog>
      </div>
    `);
    const before = container.querySelector('#before') as HTMLElement;
    const el = container.querySelector(
      'media-chrome-dialog'
    ) as MediaChromeDialog;
    before.focus();
    el.focus();

    const evt = keydown(el, { key: 'Escape' });
    assert.isTrue(evt.defaultPrevented);
    assert.isFalse(el.open);
    assert.equal(document.activeElement, before);
  });

  it('ignores keys with modifiers and keys it does not use', async () => {
    const el = await fixture<MediaChromeDialog>(
      `<media-chrome-dialog open></media-chrome-dialog>`
    );
    assert.deepEqual(el.keysUsed, ['Escape', 'Tab']);

    for (const mod of ['ctrlKey', 'altKey', 'metaKey']) {
      const evt = keydown(el, { key: 'Escape', [mod]: true });
      assert.isFalse(evt.defaultPrevented, `${mod} ignored`);
      assert.isTrue(el.open, `${mod} does not close`);
    }

    const evt = keydown(el, { key: 'a' });
    assert.isFalse(evt.defaultPrevented);
    assert.isTrue(el.open);
  });

  it('moves focus to siblings on Tab / Shift+Tab', async () => {
    const container = await fixture<HTMLDivElement>(`
      <div>
        <button id="prev">prev</button>
        <media-chrome-dialog open></media-chrome-dialog>
        <button id="next">next</button>
      </div>
    `);
    const el = container.querySelector(
      'media-chrome-dialog'
    ) as MediaChromeDialog;

    const tab = keydown(el, { key: 'Tab' });
    assert.isTrue(tab.defaultPrevented);
    assert.equal(document.activeElement, container.querySelector('#next'));

    keydown(el, { key: 'Tab', shiftKey: true });
    assert.equal(document.activeElement, container.querySelector('#prev'));
    assert.isTrue(el.open, 'Tab does not close');
  });

  it('stops handling events once disconnected', async () => {
    const el = await fixture<MediaChromeDialog>(
      `<media-chrome-dialog open></media-chrome-dialog>`
    );
    el.remove();
    const evt = keydown(el, { key: 'Escape' });
    assert.isFalse(evt.defaultPrevented);
    assert.isTrue(el.open);
    el.dispatchEvent(new InvokeEvent({ relatedTarget: document.body }));
    assert.isTrue(el.open);
  });

  it('supports subclasses overriding the slot template', async () => {
    class CustomDialog extends MediaChromeDialog {
      static getSlotTemplateHTML() {
        return `<div id="custom"><slot></slot></div>`;
      }
    }
    if (!customElements.get('custom-test-dialog')) {
      customElements.define('custom-test-dialog', CustomDialog);
    }
    const el = await fixture<MediaChromeDialog>(
      `<custom-test-dialog></custom-test-dialog>`
    );
    assert.exists(el.shadowRoot.querySelector('#custom'));
    assert.notExists(el.shadowRoot.querySelector('slot#content'));
  });
});
