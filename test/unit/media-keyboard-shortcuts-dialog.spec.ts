import { assert, expect, fixture, waitUntil } from '@open-wc/testing';
import '../../src/js/index.js';
import { MediaController } from '../../src/js/media-controller.js';
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

describe('<media-keyboard-shortcuts-dialog>', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it('lists every shortcut when none are turned off', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );

    assert.includeMembers(
      listedKeys(el),
      ['Space', 'k', 'm', 'f', 'c', 'p', 'j', 'l'],
      'all default shortcut keys are listed'
    );
    assert.include(listedDescriptions(el), 'Toggle fullscreen');
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

  it('lists no shortcuts when nohotkeys is set', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog nohotkeys></media-keyboard-shortcuts-dialog>`
    );

    assert.isEmpty(listedKeys(el), 'no shortcut keys are listed');
    assert.notInclude(listedDescriptions(el), 'Toggle Playback');
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

  it('updates the listed shortcuts when nohotkeys is toggled', async () => {
    const el = await fixture<MediaKeyboardShortcutsDialog>(
      `<media-keyboard-shortcuts-dialog></media-keyboard-shortcuts-dialog>`
    );
    assert.isNotEmpty(listedKeys(el));

    el.toggleAttribute('nohotkeys', true);
    assert.isEmpty(listedKeys(el), 'everything is removed');

    el.toggleAttribute('nohotkeys', false);
    assert.isNotEmpty(listedKeys(el), 'everything comes back');
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

  async function openDialog(mediaController: MediaController) {
    pressShiftSlash(mediaController);

    await waitUntil(
      () => mediaController.querySelector('media-keyboard-shortcuts-dialog'),
      'keyboard shortcuts dialog was added'
    );

    return mediaController.querySelector<MediaKeyboardShortcutsDialog>(
      'media-keyboard-shortcuts-dialog'
    );
  }

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

    dialog.open = false;
    (mediaController.hotkeys as any).add('nof');

    assert.notInclude(listedKeys(dialog), 'f', 'fullscreen key is removed');
  });
});
