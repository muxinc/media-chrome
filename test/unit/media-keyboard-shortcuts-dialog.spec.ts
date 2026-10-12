import { assert, expect, fixture, waitUntil } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../src/js/index.js';
import { MediaChromeDialog } from '../../src/js/media-chrome-dialog.js';
import { MediaController } from '../../src/js/media-controller.js';
import { AttributeTokenList } from '../../src/js/utils/attribute-token-list.js';
import { MediaKeyboardShortcutsDialog } from '../../src/js/media-keyboard-shortcuts-dialog.js';

/**
 * The key labels the dialog is currently advertising, e.g. ['Space', 'k', 'm', ...].
 */
function listedKeys(el: MediaKeyboardShortcutsDialog): string[] {
  return [...el.shadowRoot.querySelectorAll('#content .key')].map((key) =>
    key.textContent.trim()
  );
}

/**
 * The shortcut descriptions the dialog is currently advertising.
 */
function listedDescriptions(el: MediaKeyboardShortcutsDialog): string[] {
  return [...el.shadowRoot.querySelectorAll('#content .description')].map(
    (description) => description.textContent.trim()
  );
}

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

const ALL_KEYS_OFF =
  'nok nospace nom nof noc nop noj nol noarrowup noarrowleft noarrowright noarrowdown no< no>';

describe('<media-keyboard-shortcuts-dialog>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

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
    assert.equal(rows.length, 12);

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

    // The binding that opens the dialog is always listed last.
    const lastRow = rows[rows.length - 1];
    assert.equal(lastRow.querySelector('.key').textContent, 'SHIFT+/');
    assert.equal(
      lastRow.querySelector('.description').textContent.trim(),
      'Show keyboard shortcuts'
    );
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

  it('does not list a shortcut turned off via the hotkeys attribute', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog hotkeys="nof nom"></media-keyboard-shortcuts-dialog>`
    );

    assert.notInclude(listedKeys(el), 'f', 'fullscreen key is not listed');
    assert.notInclude(listedKeys(el), 'm', 'mute key is not listed');
    assert.notInclude(listedDescriptions(el), 'Toggle fullscreen');
    assert.notInclude(listedDescriptions(el), 'Toggle mute');

    // Untouched shortcuts are still listed.
    assert.include(listedKeys(el), 'c');
    assert.include(listedDescriptions(el), 'Toggle Picture in Picture');
  });

  it('drops only the disabled key when a shortcut has alternatives', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog hotkeys="nok"></media-keyboard-shortcuts-dialog>`
    );

    assert.notInclude(listedKeys(el), 'k', 'k is not listed');
    assert.include(listedKeys(el), 'Space', 'Space is still listed');
    assert.include(
      listedDescriptions(el),
      'Toggle Playback',
      'the row is kept because Space still works'
    );
  });

  it('drops the shortcut once all of its keys are turned off', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog hotkeys="nok nospace"></media-keyboard-shortcuts-dialog>`
    );

    assert.notInclude(listedKeys(el), 'k');
    assert.notInclude(listedKeys(el), 'Space');
    assert.notInclude(listedDescriptions(el), 'Toggle Playback');
  });

  it('matches tokens against the key, not its display label', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog hotkeys="noarrowleft no<"></media-keyboard-shortcuts-dialog>`
    );

    assert.notInclude(listedKeys(el), '←', 'left arrow is not listed');
    assert.include(listedKeys(el), 'j', 'j still seeks back');
    assert.notInclude(listedDescriptions(el), 'Decrease playback rate');
  });

  it('only lists the Shift + / binding when every other key is turned off', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog hotkeys="${ALL_KEYS_OFF}"></media-keyboard-shortcuts-dialog>`
    );

    assert.deepEqual(listedKeys(el), ['SHIFT+/']);
    assert.deepEqual(listedDescriptions(el), ['Show keyboard shortcuts']);
  });

  it('does not list Shift + / when noshift+/ is set', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog hotkeys="noshift+/"></media-keyboard-shortcuts-dialog>`
    );

    assert.notInclude(listedKeys(el), 'SHIFT+/');
  });

  it('reflects the hotkeys property to the attribute', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    assert.isUndefined(el.hotkeys);

    el.hotkeys = 'nof';
    assert.equal(el.getAttribute('hotkeys'), 'nof');
    assert.equal(el.hotkeys, 'nof');
    assert.notInclude(listedKeys(el), 'f', 'setting the property re-renders');

    el.hotkeys = undefined;
    assert.isFalse(el.hasAttribute('hotkeys'));
    assert.isUndefined(el.hotkeys);
  });

  it('updates the listed shortcuts when hotkeys changes', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    assert.include(listedKeys(el), 'f', 'fullscreen key starts out listed');

    el.setAttribute('hotkeys', 'nof');
    assert.notInclude(listedKeys(el), 'f', 'fullscreen key is removed');

    el.removeAttribute('hotkeys');
    assert.include(listedKeys(el), 'f', 'fullscreen key comes back');
  });
});

describe('<media-controller> keyboard shortcuts dialog', () => {
  /**
   * Open the dialog the way a user does, with Shift + /.
   */
  function pressShiftSlash(mediaController: MediaController) {
    for (const type of ['keydown', 'keyup']) {
      mediaController.dispatchEvent(
        new KeyboardEvent(type, {
          key: '?',
          shiftKey: true,
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  function getDialog(mediaController: MediaController) {
    return mediaController.querySelector<MediaKeyboardShortcutsDialog>(
      'media-keyboard-shortcuts-dialog'
    );
  }

  async function openDialog(mediaController: MediaController) {
    pressShiftSlash(mediaController);
    await waitUntil(
      () => getDialog(mediaController),
      'keyboard shortcuts dialog was added'
    );
    return getDialog(mediaController);
  }

  const addNoShiftSlash = (mediaController: MediaController) =>
    (mediaController.hotkeys as AttributeTokenList).add('noshift+/');

  it('does not advertise shortcuts disabled on the controller', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller hotkeys="nof nom"></media-controller>
    `);

    const dialog = await openDialog(mediaController);

    assert(dialog.open, 'dialog is open');
    assert.notInclude(listedKeys(dialog), 'f', 'fullscreen key is not listed');
    assert.notInclude(listedKeys(dialog), 'm', 'mute key is not listed');
    assert.include(listedKeys(dialog), 'c', 'untouched shortcut is listed');
  });

  it('picks up hotkeys changed after the dialog was first opened', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller></media-controller>
    `);

    const dialog = await openDialog(mediaController);
    assert.include(listedKeys(dialog), 'f', 'fullscreen key starts out listed');

    (mediaController.hotkeys as AttributeTokenList).add('nof');

    assert.notInclude(listedKeys(dialog), 'f', 'fullscreen key is removed');
  });

  it('still lists Shift + / when every other key is turned off', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller hotkeys="${ALL_KEYS_OFF}"></media-controller>
    `);

    const dialog = await openDialog(mediaController);

    assert(dialog.open, 'Shift + / still opens the dialog');
    assert.deepEqual(listedKeys(dialog), ['SHIFT+/']);
  });

  it('does not open the dialog when noshift+/ is set from the start', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller hotkeys="noshift+/"></media-controller>
    `);

    pressShiftSlash(mediaController);

    assert.isNull(getDialog(mediaController), 'dialog was never created');
  });

  it('does not open the dialog when noshift+/ is added before it was ever opened', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller></media-controller>
    `);

    addNoShiftSlash(mediaController);
    pressShiftSlash(mediaController);

    assert.isNull(getDialog(mediaController), 'dialog was never created');
  });

  for (const [name, turnOff] of [
    ['noshift+/ is added', addNoShiftSlash],
    [
      'every hotkey is turned off',
      (mediaController: MediaController) =>
        mediaController.toggleAttribute('nohotkeys', true),
    ],
  ] as const) {
    it(`closes the dialog when ${name}`, async () => {
      const mediaController = await fixture<MediaController>(`
        <media-controller></media-controller>
      `);

      const dialog = await openDialog(mediaController);
      assert(dialog.open, 'dialog is open');

      turnOff(mediaController);

      assert.isFalse(dialog.open, 'dialog is closed');
    });
  }
});
