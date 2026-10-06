import { assert, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { MediaChromeDialog } from '../../src/js/media-chrome-dialog.js';
// Side-effect import: the named import below is only used as a type and would be elided.
import '../../src/js/media-keyboard-shortcuts-dialog.js';
import { MediaKeyboardShortcutsDialog } from '../../src/js/media-keyboard-shortcuts-dialog.js';

const docKeydown = (init: KeyboardEventInit) => {
  const evt = new KeyboardEvent('keydown', {
    bubbles: true,
    composed: true,
    cancelable: true,
    ...init,
  });
  document.dispatchEvent(evt);
  return evt;
};

describe('<media-keyboard-shortcuts-dialog>', () => {
  it('is a media-chrome-dialog with a dialog role', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    assert.instanceOf(el, MediaChromeDialog);
    assert.equal(el.getAttribute('role'), 'dialog');
    assert.isFalse(el.open);
  });

  it('renders the keyboard shortcuts table', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    const content = el.shadowRoot.querySelector('#content');
    assert.exists(content);
    assert.equal(
      content.querySelector('h2').textContent.trim(),
      'Keyboard Shortcuts'
    );

    const rows = content.querySelectorAll('.shortcuts-table tr');
    assert.equal(rows.length, 11);

    const descriptions = Array.from(
      content.querySelectorAll('.description')
    ).map((d) => d.textContent.trim());
    assert.include(descriptions, 'Toggle Playback');
    assert.include(descriptions, 'Toggle fullscreen');
    assert.include(descriptions, 'Increase playback rate');

    // First row has two keys ("Space" or "k") joined by a separator.
    const firstRowKeys = Array.from(rows[0].querySelectorAll('.key')).map(
      (k) => k.textContent
    );
    assert.deepEqual(firstRowKeys, ['Space', 'k']);
    assert.equal(rows[0].querySelectorAll('.key-separator').length, 1);
    // Single key rows have no separator.
    assert.equal(rows[1].querySelectorAll('.key-separator').length, 0);
  });

  it('closes on Escape pressed anywhere in the document when open', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    el.open = true;
    const evt = docKeydown({ key: 'Escape' });
    assert.isFalse(el.open);
    assert.isTrue(evt.defaultPrevented);
  });

  it('closes on Shift + / and Shift + ?', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog open></media-keyboard-shortcuts-dialog>`
    );
    assert.isTrue(el.open);
    docKeydown({ key: '?', shiftKey: true });
    assert.isFalse(el.open);

    el.open = true;
    docKeydown({ key: '/', shiftKey: true });
    assert.isFalse(el.open);
  });

  it('ignores unrelated keys and modified keys', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog open></media-keyboard-shortcuts-dialog>`
    );
    let evt = docKeydown({ key: '/' });
    assert.isTrue(el.open, 'plain / does not close');
    assert.isFalse(evt.defaultPrevented);

    evt = docKeydown({ key: 'k' });
    assert.isTrue(el.open, 'other keys do not close');

    for (const mod of ['ctrlKey', 'altKey', 'metaKey']) {
      evt = docKeydown({ key: 'Escape', [mod]: true });
      assert.isTrue(el.open, `${mod}+Escape does not close`);
      assert.isFalse(evt.defaultPrevented);
    }
  });

  it('adds and removes the document keydown listener as it opens and closes', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    const addSpy = spy(document, 'addEventListener');
    const removeSpy = spy(document, 'removeEventListener');
    try {
      el.open = true;
      assert(addSpy.calledWith('keydown'), 'added on open');
      el.open = false;
      assert(removeSpy.calledWith('keydown'), 'removed on close');
      const handler = addSpy.getCalls().find((c) => c.args[0] === 'keydown')
        .args[1];
      assert(
        removeSpy.calledWith('keydown', handler),
        'removes the same handler'
      );
    } finally {
      addSpy.restore();
      removeSpy.restore();
    }
  });

  it('closes when clicking the backdrop (the host itself)', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog open></media-keyboard-shortcuts-dialog>`
    );
    el.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true })
    );
    assert.isFalse(el.open);
  });

  it('stays open when clicking inside the content', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog open></media-keyboard-shortcuts-dialog>`
    );
    const heading = el.shadowRoot.querySelector('h2');
    heading.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true })
    );
    assert.isTrue(el.open);
  });

  it('removes document listeners when disconnected', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog open></media-keyboard-shortcuts-dialog>`
    );
    el.remove();
    docKeydown({ key: 'Escape' });
    assert.isTrue(el.open, 'disconnected dialog ignores document keys');
  });

  it('re-adds listeners when reconnected while open', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog open></media-keyboard-shortcuts-dialog>`
    );
    const parent = el.parentElement;
    el.remove();
    parent.append(el);
    docKeydown({ key: 'Escape' });
    assert.isFalse(el.open);
  });
});
