import {
  aTimeout,
  assert,
  fixture,
  nextFrame,
  waitUntil,
} from '@open-wc/testing';
import { spy, stub } from 'sinon';
import type { SinonSpy } from 'sinon';
import { constants } from '../../src/js/index.js';
import '../../src/js/media-controller.js';
import { MediaController } from '../../src/js/media-controller.js';
import { MediaKeyboardShortcutsDialog } from '../../src/js/media-keyboard-shortcuts-dialog.js';
import { setLanguage } from '../../src/js/utils/i18n.js';

const { MediaUIEvents, MediaStateChangeEvents } = constants;
const MEDIA_UI_EVENT_TYPES: string[] = Object.values(MediaUIEvents);

type FakeStore = {
  state: Record<string, any>;
  getState: () => Record<string, any>;
  dispatch: SinonSpy;
  subscribe: SinonSpy;
  unsubscribe: SinonSpy;
  callback?: (state: any) => void;
};

/**
 * A minimal stand-in for the MediaStore so hotkey handling can be verified
 * via the requests dispatched to it, without any real media playback.
 */
const createFakeStore = (state: Record<string, any> = {}): FakeStore => {
  const unsubscribe = spy();
  const store: FakeStore = {
    state: { mediaPaused: true, ...state },
    getState() {
      return store.state;
    },
    dispatch: spy(),
    unsubscribe,
    subscribe: spy((cb) => {
      store.callback = cb;
      return unsubscribe;
    }),
  };
  return store;
};

/** Media UI requests (as opposed to internal store requests) dispatched to the store. */
const uiRequests = (store: FakeStore) =>
  store.dispatch
    .getCalls()
    .map((c) => c.args[0])
    .filter((evt) => MEDIA_UI_EVENT_TYPES.includes(evt.type));

const lastRequestOf = (store: FakeStore, type: string) =>
  store.dispatch
    .getCalls()
    .map((c) => c.args[0])
    .filter((evt) => evt.type === type)
    .pop();

const keyEvent = (type: string, key: string, init: KeyboardEventInit = {}) =>
  new KeyboardEvent(type, {
    key,
    bubbles: true,
    composed: true,
    cancelable: true,
    ...init,
  });

/** Presses (keydown + keyup) a key on the target and returns the keydown event. */
const press = (
  target: EventTarget,
  key: string,
  init: KeyboardEventInit = {}
) => {
  const down = keyEvent('keydown', key, init);
  target.dispatchEvent(down);
  target.dispatchEvent(keyEvent('keyup', key, init));
  return down;
};

async function setup(attrs = '', state: Record<string, any> = {}) {
  const mediaController = await fixture<MediaController>(`
    <media-controller nodefaultstore ${attrs}>
      <video slot="media" muted playsinline></video>
      <div id="child" tabindex="0"></div>
    </media-controller>
  `);
  const store = createFakeStore(state);
  mediaController.mediaStore = store as any;
  const child = mediaController.querySelector('#child') as HTMLElement;
  return { mediaController, store, child };
}

describe('<media-controller> hotkeys', () => {
  describe('keyboard shortcut requests', () => {
    it('toggles playback with Space and k', async () => {
      const { mediaController, store } = await setup();

      press(mediaController, ' ');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_PLAY_REQUEST
      );

      store.state.mediaPaused = false;
      press(mediaController, 'k');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_PAUSE_REQUEST
      );
      assert.equal(uiRequests(store).length, 2);
    });

    it('toggles mute with m', async () => {
      const { mediaController, store } = await setup('', {
        mediaVolumeLevel: 'high',
      });
      press(mediaController, 'm');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_MUTE_REQUEST
      );

      store.state.mediaVolumeLevel = 'off';
      press(mediaController, 'm');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_UNMUTE_REQUEST
      );
    });

    it('toggles fullscreen with f', async () => {
      const { mediaController, store } = await setup();
      press(mediaController, 'f');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST
      );

      store.state.mediaIsFullscreen = true;
      press(mediaController, 'f');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
      );
    });

    it('toggles captions with c', async () => {
      const { mediaController, store } = await setup();
      press(mediaController, 'c');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST
      );
    });

    it('toggles picture in picture with p', async () => {
      const { mediaController, store } = await setup();
      press(mediaController, 'p');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_ENTER_PIP_REQUEST
      );

      store.state.mediaIsPip = true;
      press(mediaController, 'p');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_EXIT_PIP_REQUEST
      );
    });

    it('seeks backward and forward by the default offset', async () => {
      const { mediaController, store } = await setup('', {
        mediaCurrentTime: 30,
      });

      press(mediaController, 'ArrowLeft');
      let req = uiRequests(store).pop();
      assert.equal(req.type, MediaUIEvents.MEDIA_SEEK_REQUEST);
      assert.equal(req.detail, 20);

      press(mediaController, 'j');
      assert.equal(uiRequests(store).pop().detail, 20);

      press(mediaController, 'ArrowRight');
      req = uiRequests(store).pop();
      assert.equal(req.type, MediaUIEvents.MEDIA_SEEK_REQUEST);
      assert.equal(req.detail, 40);

      press(mediaController, 'l');
      assert.equal(uiRequests(store).pop().detail, 40);
    });

    it('clamps backward seeks at 0 and treats unknown current time as 0', async () => {
      const { mediaController, store } = await setup('', {
        mediaCurrentTime: 3,
      });
      press(mediaController, 'ArrowLeft');
      assert.equal(uiRequests(store).pop().detail, 0);

      store.state.mediaCurrentTime = undefined;
      press(mediaController, 'ArrowRight');
      assert.equal(uiRequests(store).pop().detail, 10);
    });

    it('uses keyboardbackwardseekoffset / keyboardforwardseekoffset', async () => {
      const { mediaController, store } = await setup(
        'keyboardbackwardseekoffset="5" keyboardforwardseekoffset="15"',
        { mediaCurrentTime: 30 }
      );
      press(mediaController, 'ArrowLeft');
      assert.equal(uiRequests(store).pop().detail, 25);
      press(mediaController, 'ArrowRight');
      assert.equal(uiRequests(store).pop().detail, 45);
    });

    it('changes volume with ArrowUp / ArrowDown using the default step', async () => {
      const { mediaController, store } = await setup('', { mediaVolume: 0.5 });

      press(mediaController, 'ArrowUp');
      let req = uiRequests(store).pop();
      assert.equal(req.type, MediaUIEvents.MEDIA_VOLUME_REQUEST);
      assert.closeTo(req.detail, 0.525, 1e-9);

      press(mediaController, 'ArrowDown');
      req = uiRequests(store).pop();
      assert.equal(req.type, MediaUIEvents.MEDIA_VOLUME_REQUEST);
      assert.closeTo(req.detail, 0.475, 1e-9);
    });

    it('clamps volume between 0 and 1 and defaults unknown volume to 1', async () => {
      const { mediaController, store } = await setup('', {
        mediaVolume: undefined,
      });
      press(mediaController, 'ArrowUp');
      assert.equal(uiRequests(store).pop().detail, 1);

      store.state.mediaVolume = 0.01;
      press(mediaController, 'ArrowDown');
      assert.equal(uiRequests(store).pop().detail, 0);
    });

    it('uses keyboardupvolumestep / keyboarddownvolumestep', async () => {
      const { mediaController, store } = await setup(
        'keyboardupvolumestep="0.2" keyboarddownvolumestep="0.3"',
        { mediaVolume: 0.5 }
      );
      press(mediaController, 'ArrowUp');
      assert.closeTo(uiRequests(store).pop().detail, 0.7, 1e-9);
      press(mediaController, 'ArrowDown');
      assert.closeTo(uiRequests(store).pop().detail, 0.2, 1e-9);
    });

    it('changes playback rate with < and >, clamped to the allowed range', async () => {
      const { mediaController, store } = await setup();

      // Unknown playback rate defaults to 1
      press(mediaController, '<', { shiftKey: true });
      let req = uiRequests(store).pop();
      assert.equal(req.type, MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST);
      assert.equal(req.detail, '0.75');

      press(mediaController, '>', { shiftKey: true });
      assert.equal(uiRequests(store).pop().detail, '1.25');

      store.state.mediaPlaybackRate = 0.25;
      press(mediaController, '<', { shiftKey: true });
      assert.equal(uiRequests(store).pop().detail, '0.25');

      store.state.mediaPlaybackRate = 2;
      press(mediaController, '>', { shiftKey: true });
      assert.equal(uiRequests(store).pop().detail, '2.00');
    });

    it('handles keys pressed on descendants', async () => {
      const { store, child } = await setup();
      press(child, 'k');
      assert.equal(
        uiRequests(store).pop().type,
        MediaUIEvents.MEDIA_PLAY_REQUEST
      );
    });
  });

  describe('keydown / keyup handling', () => {
    it('prevents default on keydown for keys that may scroll the page', async () => {
      const { mediaController } = await setup();
      for (const key of [
        ' ',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
      ]) {
        const down = press(mediaController, key);
        assert.isTrue(
          down.defaultPrevented,
          `${JSON.stringify(key)} prevented`
        );
      }
      const down = press(mediaController, 'k');
      assert.isFalse(down.defaultPrevented, 'k not prevented');
    });

    it('does not prevent default for arrow keys pressed on range inputs', async () => {
      const { mediaController, store } = await setup();
      const range = document.createElement('media-time-range');
      mediaController.append(range);

      const down = press(range, 'ArrowLeft');
      assert.isFalse(down.defaultPrevented);
      // The range declares the arrow keys in its keysUsed, so the
      // controller leaves them to the range on keyup.
      assert.equal(uiRequests(store).length, 0);

      const volumeRange = document.createElement('media-volume-range');
      mediaController.append(volumeRange);
      assert.isFalse(press(volumeRange, 'ArrowUp').defaultPrevented);
    });

    it('ignores unsupported keys and keys with meta / alt modifiers', async () => {
      const { mediaController, store } = await setup();
      press(mediaController, 'x');
      press(mediaController, 'k', { metaKey: true });
      press(mediaController, 'k', { altKey: true });
      press(mediaController, '?');
      press(mediaController, '/');
      assert.equal(uiRequests(store).length, 0);
      assert.notExists(
        mediaController.querySelector('media-keyboard-shortcuts-dialog')
      );
    });

    it('only handles a shortcut on keyup after a matching keydown', async () => {
      const { mediaController, store } = await setup();

      // keyup without keydown
      mediaController.dispatchEvent(keyEvent('keyup', 'k'));
      assert.equal(uiRequests(store).length, 0);

      // keydown on a shortcut key, but keyup of an unsupported key
      mediaController.dispatchEvent(keyEvent('keydown', 'k'));
      mediaController.dispatchEvent(keyEvent('keyup', 'x'));
      assert.equal(uiRequests(store).length, 0);
      // the keyup listener was removed
      mediaController.dispatchEvent(keyEvent('keyup', 'k'));
      assert.equal(uiRequests(store).length, 0);

      // keydown on an unsupported key after a supported one cancels the pending keyup
      mediaController.dispatchEvent(keyEvent('keydown', 'k'));
      mediaController.dispatchEvent(keyEvent('keydown', 'x'));
      mediaController.dispatchEvent(keyEvent('keyup', 'k'));
      assert.equal(uiRequests(store).length, 0);

      // a single keydown only handles a single keyup
      mediaController.dispatchEvent(keyEvent('keydown', 'k'));
      mediaController.dispatchEvent(keyEvent('keyup', 'k'));
      mediaController.dispatchEvent(keyEvent('keyup', 'k'));
      assert.equal(uiRequests(store).length, 1);
    });

    it('skips keys the target declares in its keysused attribute', async () => {
      const { store, child } = await setup();
      child.setAttribute('keysused', 'Space ArrowLeft');

      const down = press(child, ' ');
      press(child, 'ArrowLeft');
      assert.equal(uiRequests(store).length, 0);
      // preventDefault still happens on keydown since only the handler checks keysused
      assert.isTrue(down.defaultPrevented);

      press(child, 'k');
      assert.equal(uiRequests(store).length, 1);
    });

    it('skips keys the target declares in its keysUsed property', async () => {
      const { store, child } = await setup();
      (child as any).keysUsed = ['k', 'Space'];
      press(child, 'k');
      press(child, ' ');
      assert.equal(uiRequests(store).length, 0);
      press(child, 'm');
      assert.equal(uiRequests(store).length, 1);
    });
  });

  describe('hotkeys attribute', () => {
    it('blocks keys listed in the hotkeys blocklist', async () => {
      const { mediaController, store } = await setup(
        'hotkeys="noarrowleft nospace nok"'
      );
      const left = press(mediaController, 'ArrowLeft');
      const space = press(mediaController, ' ');
      press(mediaController, 'k');
      assert.equal(uiRequests(store).length, 0);
      assert.isFalse(left.defaultPrevented, 'blocked arrow not prevented');
      assert.isFalse(space.defaultPrevented, 'blocked space not prevented');

      assert.isTrue(press(mediaController, 'ArrowRight').defaultPrevented);
      assert.equal(uiRequests(store).length, 1);
    });

    it('updates the blocklist when the attribute or property changes', async () => {
      const { mediaController, store } = await setup();
      mediaController.hotkeys = 'nom';
      assert.equal(mediaController.getAttribute('hotkeys'), 'nom');
      assert.isTrue((mediaController.hotkeys as any).contains('nom'));

      press(mediaController, 'm');
      assert.equal(uiRequests(store).length, 0);

      mediaController.removeAttribute('hotkeys');
      press(mediaController, 'm');
      assert.equal(uiRequests(store).length, 1);
    });

    it('supports blocking the keyboard shortcuts dialog with noshift+/', async () => {
      const { mediaController } = await setup('hotkeys="noshift+/"');
      press(mediaController, '?', { shiftKey: true });
      press(mediaController, '/', { shiftKey: true });
      assert.notExists(
        mediaController.querySelector('media-keyboard-shortcuts-dialog')
      );
    });
  });

  describe('nohotkeys attribute', () => {
    it('disables hotkeys when present initially and re-enables them when removed', async () => {
      const { mediaController, store } = await setup('nohotkeys');
      assert.isTrue(mediaController.noHotkeys);

      press(mediaController, 'k');
      assert.equal(uiRequests(store).length, 0);

      mediaController.removeAttribute('nohotkeys');
      press(mediaController, 'k');
      assert.equal(uiRequests(store).length, 1);

      mediaController.noHotkeys = true;
      assert.isTrue(mediaController.hasAttribute('nohotkeys'));
      press(mediaController, 'k');
      assert.equal(uiRequests(store).length, 1);
    });

    it('disables a pending keyup when nohotkeys is set between keydown and keyup', async () => {
      const { mediaController, store } = await setup();
      mediaController.dispatchEvent(keyEvent('keydown', 'k'));
      mediaController.setAttribute('nohotkeys', '');
      mediaController.dispatchEvent(keyEvent('keyup', 'k'));
      assert.equal(uiRequests(store).length, 0);
    });

    it('warns when both hotkeys and nohotkeys are set', async () => {
      const warn = stub(console, 'warn');
      try {
        const { mediaController } = await setup('hotkeys="nok"');
        mediaController.setAttribute('nohotkeys', '');
        assert(
          warn.calledWithMatch(/Both `hotkeys` and `nohotkeys`/),
          'warned about conflicting attributes'
        );
      } finally {
        warn.restore();
      }
    });
  });

  describe('keyboard shortcuts dialog', () => {
    it('opens the dialog on Shift + ? and reuses it', async () => {
      const { mediaController, store } = await setup();

      press(mediaController, '?', { shiftKey: true });
      const dialog = mediaController.querySelector(
        'media-keyboard-shortcuts-dialog'
      ) as MediaKeyboardShortcutsDialog;
      assert.instanceOf(dialog, MediaKeyboardShortcutsDialog);
      assert.isTrue(dialog.open);
      assert.equal(uiRequests(store).length, 0);

      // Pressing it again while open closes it (handled by the dialog) and
      // the controller does not reopen it on keyup.
      press(mediaController, '?', { shiftKey: true });
      assert.isFalse(dialog.open);

      press(mediaController, '/', { shiftKey: true });
      assert.isTrue(dialog.open);
      assert.equal(
        mediaController.querySelectorAll('media-keyboard-shortcuts-dialog')
          .length,
        1
      );
    });

    it('removes the dialog when the controller is disconnected', async () => {
      const { mediaController } = await setup();
      press(mediaController, '?', { shiftKey: true });
      const dialog = mediaController.querySelector(
        'media-keyboard-shortcuts-dialog'
      );
      assert.exists(dialog);
      // Let the dialog finish its (microtask deferred) init before removal.
      await nextFrame();

      mediaController.remove();
      assert.isFalse(dialog.isConnected);
      assert.notExists(
        mediaController.querySelector('media-keyboard-shortcuts-dialog')
      );
    });
  });
});

describe('<media-controller> options attributes', () => {
  it('exposes default* and preference attributes as properties', async () => {
    const { mediaController } = await setup();
    const mc = mediaController;

    assert.isFalse(mc.defaultSubtitles);
    mc.defaultSubtitles = true;
    assert.isTrue(mc.hasAttribute('defaultsubtitles'));

    assert.notExists(mc.defaultStreamType);
    mc.defaultStreamType = 'live';
    assert.equal(mc.getAttribute('defaultstreamtype'), 'live');
    assert.equal(mc.defaultStreamType, 'live');

    mc.defaultDuration = 42;
    assert.equal(mc.getAttribute('defaultduration'), '42');
    assert.equal(mc.defaultDuration, 42);

    mc.liveEdgeOffset = 5;
    assert.equal(mc.liveEdgeOffset, 5);

    mc.keysUsed = 'k m';
    assert.equal(mc.getAttribute('keysused'), 'k m');
    assert.equal(mc.keysUsed, 'k m');

    for (const prop of [
      'noAutoSeekToLive',
      'noVolumePref',
      'noMutedPref',
      'noSubtitlesLangPref',
    ]) {
      assert.isFalse(mc[prop], `${prop} default`);
      mc[prop] = true;
      assert.isTrue(mc[prop], `${prop} set`);
      assert.isTrue(mc.hasAttribute(prop.toLowerCase()), `${prop} attr`);
    }

    assert.isTrue(mc.noDefaultStore);
    mc.noDefaultStore = false;
    assert.isFalse(mc.hasAttribute('nodefaultstore'));
  });

  it('dispatches options changes for defaultsubtitles and defaultstreamtype', async () => {
    const { mediaController, store } = await setup();

    mediaController.setAttribute('defaultsubtitles', '');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      defaultSubtitles: true,
    });
    mediaController.removeAttribute('defaultsubtitles');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      defaultSubtitles: false,
    });

    mediaController.setAttribute('defaultstreamtype', 'live');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      defaultStreamType: 'live',
    });
    mediaController.removeAttribute('defaultstreamtype');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      defaultStreamType: undefined,
    });
  });

  it('dispatches options changes for liveedgeoffset and seektoliveoffset', async () => {
    const { mediaController, store } = await setup();

    mediaController.setAttribute('liveedgeoffset', '5');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      liveEdgeOffset: 5,
      seekToLiveOffset: 5,
    });

    mediaController.setAttribute('seektoliveoffset', '3');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      seekToLiveOffset: 3,
    });

    mediaController.setAttribute('liveedgeoffset', '6');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      liveEdgeOffset: 6,
      seekToLiveOffset: 3,
    });

    mediaController.removeAttribute('seektoliveoffset');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      seekToLiveOffset: 6,
    });

    mediaController.removeAttribute('liveedgeoffset');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      liveEdgeOffset: undefined,
      seekToLiveOffset: undefined,
    });

    mediaController.setAttribute('seektoliveoffset', '2');
    mediaController.removeAttribute('seektoliveoffset');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      seekToLiveOffset: undefined,
    });
  });

  it('dispatches options changes for noautoseektolive, novolumepref and nomutedpref', async () => {
    const { mediaController, store } = await setup();

    mediaController.setAttribute('noautoseektolive', '');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      noAutoSeekToLive: true,
    });

    mediaController.setAttribute('novolumepref', '');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      noVolumePref: true,
    });
    mediaController.removeAttribute('novolumepref');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      noVolumePref: false,
    });

    mediaController.setAttribute('nomutedpref', '');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      noMutedPref: true,
    });
    mediaController.removeAttribute('nomutedpref');
    assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
      noMutedPref: false,
    });
  });

  it('dispatches a loop request when the loop attribute changes', async () => {
    const { mediaController, store } = await setup();
    mediaController.setAttribute('loop', '');
    let req = lastRequestOf(store, MediaUIEvents.MEDIA_LOOP_REQUEST);
    assert.isTrue(req.detail);
    mediaController.removeAttribute('loop');
    req = lastRequestOf(store, MediaUIEvents.MEDIA_LOOP_REQUEST);
    assert.isFalse(req.detail);
  });

  it('dispatches a language option change and sets the language', async () => {
    const { mediaController, store } = await setup();
    try {
      mediaController.setAttribute('lang', 'en-US');
      assert.deepEqual(lastRequestOf(store, 'optionschangerequest').detail, {
        mediaLang: 'en-US',
      });
      assert.equal(mediaController.resolvedLang, 'en');
    } finally {
      // Restore the module level language so other tests are not affected.
      setLanguage(globalThis.navigator?.language || 'en');
    }
  });
});

describe('<media-controller> fullscreen element', () => {
  it('defaults the fullscreen element to the controller', async () => {
    const { mediaController } = await setup();
    assert.equal(mediaController.fullscreenElement, mediaController);
  });

  it('dispatches a fullscreen element change when set and reset', async () => {
    const { mediaController, store } = await setup();
    const div = document.createElement('div');

    mediaController.fullscreenElement = div;
    assert.equal(mediaController.fullscreenElement, div);
    assert.equal(
      lastRequestOf(store, 'fullscreenelementchangerequest').detail,
      div
    );

    mediaController.fullscreenElement = null;
    assert.equal(mediaController.fullscreenElement, mediaController);
    assert.equal(
      lastRequestOf(store, 'fullscreenelementchangerequest').detail,
      mediaController
    );
  });

  it('removes a fullscreenelement attribute when the property is set', async () => {
    const { mediaController } = await setup('fullscreenelement="foo"');
    mediaController.fullscreenElement = document.createElement('div');
    assert.isFalse(mediaController.hasAttribute('fullscreenelement'));
  });

  it('requests fullscreen on the fullscreen element via the default store', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller>
        <video slot="media" muted playsinline></video>
      </media-controller>
    `);
    const container = document.createElement('div');
    document.body.append(container);
    try {
      const requestFullscreen = stub().resolves();
      (container as any).requestFullscreen = requestFullscreen;
      (container as any).webkitRequestFullScreen = requestFullscreen;
      mediaController.fullscreenElement = container;
      // The store updates its state owners asynchronously.
      await aTimeout(0);

      press(mediaController, 'f');
      assert(requestFullscreen.calledOnce, 'requestFullscreen called');
    } finally {
      container.remove();
    }
  });

  it('exits fullscreen via the document with the default store', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller>
        <video slot="media" muted playsinline></video>
      </media-controller>
    `);
    const exitKey = [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitCancelFullScreen',
    ].find((key) => key in document);
    const exit = stub(document as any, exitKey).resolves();
    try {
      mediaController.dispatchEvent(
        new CustomEvent(MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST, {
          bubbles: true,
          composed: true,
        })
      );
      assert(exit.calledOnce, `${exitKey} called`);
    } finally {
      exit.restore();
    }
  });
});

describe('<media-controller> default store options', () => {
  it('uses defaultstreamtype and defaultduration when the media has no source', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller defaultstreamtype="live" defaultduration="42" liveedgeoffset="7">
        <video slot="media" muted playsinline></video>
      </media-controller>
    `);
    await waitUntil(
      () => mediaController.getAttribute('mediastreamtype') === 'live',
      'mediastreamtype uses defaultstreamtype'
    );
    await waitUntil(
      () => mediaController.getAttribute('mediaduration') === '42',
      'mediaduration uses defaultduration'
    );

    mediaController.setAttribute('defaultstreamtype', 'on-demand');
    await waitUntil(
      () => mediaController.getAttribute('mediastreamtype') === 'on-demand',
      'mediastreamtype updates with defaultstreamtype'
    );
  });

  it('creates a default store when the store is unset, unless nodefaultstore', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller seektoliveoffset="3">
        <video slot="media" muted></video>
      </media-controller>
    `);
    const original = mediaController.mediaStore;
    assert.exists(original);
    mediaController.mediaStore = undefined;
    assert.exists(mediaController.mediaStore);
    assert.notEqual(mediaController.mediaStore, original);

    const { mediaController: noDefault } = await setup();
    noDefault.mediaStore = undefined;
    assert.notExists(noDefault.mediaStore);
  });

  it('unsubscribes from a previous store when replaced', async () => {
    const { mediaController, store } = await setup();
    assert(store.subscribe.calledOnce);
    mediaController.mediaStore = createFakeStore() as any;
    assert(store.unsubscribe.calledOnce);
  });

  it('propagates store state to receivers and dispatches state change events once per change', async () => {
    const { mediaController, store } = await setup();
    const onPaused = spy();
    mediaController.addEventListener(
      MediaStateChangeEvents.MEDIA_PAUSED,
      onPaused
    );

    store.callback({ mediaPaused: false });
    assert(onPaused.calledOnce);
    assert.isFalse(onPaused.firstCall.args[0].detail);
    await waitUntil(() => !mediaController.hasAttribute('mediapaused'));

    store.callback({ mediaPaused: false });
    assert(onPaused.calledOnce, 'unchanged state is not re-dispatched');

    store.callback({ mediaPaused: true });
    assert(onPaused.calledTwice);
    await waitUntil(() => mediaController.hasAttribute('mediapaused'));
  });
});

describe('<media-controller> media and receivers', () => {
  it('makes the media element not tab focusable unless it has a tabindex', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller nodefaultstore>
        <video slot="media" muted></video>
      </media-controller>
    `);
    assert.equal(mediaController.querySelector('video').tabIndex, -1);

    const other = await fixture<MediaController>(`
      <media-controller nodefaultstore>
        <video slot="media" muted tabindex="0"></video>
      </media-controller>
    `);
    assert.equal(other.querySelector('video').getAttribute('tabindex'), '0');
  });

  it('dispatches media element changes to the store', async () => {
    const { mediaController, store } = await setup();
    const video = mediaController.querySelector('video');
    video.remove();
    await waitUntil(
      () =>
        store.dispatch
          .getCalls()
          .some(
            (c) =>
              c.args[0].type === 'mediaelementchangerequest' &&
              c.args[0].detail === undefined
          ),
      'media unset dispatched'
    );

    const newVideo = document.createElement('video');
    newVideo.slot = 'media';
    mediaController.append(newVideo);
    await waitUntil(
      () =>
        lastRequestOf(store, 'mediaelementchangerequest')?.detail === newVideo,
      'media set dispatched'
    );
  });

  it('serializes complex state values to receiver attributes', async () => {
    const { mediaController } = await setup();
    const receiver = document.createElement('div');
    receiver.setAttribute(
      'mediachromeattributes',
      'mediabuffered mediaseekable mediapreviewcoords mediapaused mediacurrenttime mediastreamtype mediasubtitleslist'
    );
    mediaController.append(receiver);
    await waitUntil(() =>
      mediaController.mediaStateReceivers.includes(receiver)
    );

    mediaController.propagateMediaState('mediaBuffered', [
      [0, 1],
      [2, 3.5],
    ]);
    assert.equal(receiver.getAttribute('mediabuffered'), '0:1 2:3.5');

    mediaController.propagateMediaState('mediaBuffered', []);
    assert.isFalse(receiver.hasAttribute('mediabuffered'));

    mediaController.propagateMediaState('mediaSeekable', [0, 10]);
    assert.equal(receiver.getAttribute('mediaseekable'), '0:10');

    mediaController.propagateMediaState('mediaPreviewCoords', [1, 2, 3, 4]);
    assert.equal(receiver.getAttribute('mediapreviewcoords'), '1 2 3 4');

    mediaController.propagateMediaState('mediaPaused', true);
    assert.equal(receiver.getAttribute('mediapaused'), '');
    mediaController.propagateMediaState('mediaPaused', false);
    assert.isFalse(receiver.hasAttribute('mediapaused'));

    mediaController.propagateMediaState('mediaCurrentTime', 5);
    assert.equal(receiver.getAttribute('mediacurrenttime'), '5');
    mediaController.propagateMediaState('mediaCurrentTime', undefined);
    assert.isFalse(receiver.hasAttribute('mediacurrenttime'));

    mediaController.propagateMediaState('mediaStreamType', 'live');
    assert.equal(receiver.getAttribute('mediastreamtype'), 'live');

    mediaController.propagateMediaState('mediaSubtitlesList', [
      { kind: 'subtitles', language: 'en', label: 'English' },
    ]);
    assert.include(receiver.getAttribute('mediasubtitleslist'), 'en');

    // Attributes that are not listed are not propagated
    mediaController.propagateMediaState('mediaMuted', true);
    assert.isFalse(receiver.hasAttribute('mediamuted'));
  });

  it('registers and unregisters receivers when mediachromeattributes changes', async () => {
    const { mediaController } = await setup();
    const span = document.createElement('span');
    mediaController.append(span);
    await nextFrame();
    assert.notInclude(mediaController.mediaStateReceivers, span);

    span.setAttribute('mediachromeattributes', 'mediapaused');
    await waitUntil(() => mediaController.mediaStateReceivers.includes(span));

    span.setAttribute('mediachromeattributes', 'notamediaattr');
    await waitUntil(() => !mediaController.mediaStateReceivers.includes(span));
  });

  it('registers and unregisters receivers via events', async () => {
    const { mediaController } = await setup();
    const span = document.createElement('span');
    mediaController.append(span);

    span.dispatchEvent(
      new CustomEvent(MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER, {
        bubbles: true,
        composed: true,
      })
    );
    assert.include(mediaController.mediaStateReceivers, span);

    span.dispatchEvent(
      new CustomEvent(MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER, {
        bubbles: true,
        composed: true,
      })
    );
    assert.notInclude(mediaController.mediaStateReceivers, span);
  });

  it('ignores invalid and duplicate receiver registrations', async () => {
    const { mediaController } = await setup();
    const count = mediaController.mediaStateReceivers.length;
    mediaController.registerMediaStateReceiver(null);
    mediaController.registerMediaStateReceiver(mediaController);
    assert.equal(mediaController.mediaStateReceivers.length, count);

    mediaController.unregisterMediaStateReceiver(document.createElement('div'));
    assert.equal(mediaController.mediaStateReceivers.length, count);
  });

  it('propagates current store state to newly registered receivers', async () => {
    const { mediaController } = await setup('', {
      mediaStreamType: 'live',
    });
    const receiver = document.createElement('div');
    receiver.setAttribute('mediachromeattributes', 'mediastreamtype');
    mediaController.registerMediaStateReceiver(receiver);
    assert.equal(receiver.getAttribute('mediastreamtype'), null);
    // setAttr waits a macrotask for disconnected nodes
    await aTimeout(0);
    await waitUntil(
      () => receiver.getAttribute('mediastreamtype') === 'live',
      'initial state propagated'
    );
  });

  it('forwards media requests from associated elements to the store', async () => {
    const { mediaController, store } = await setup();
    const external = document.createElement('div');

    mediaController.associateElement(null);
    mediaController.associateElement(external);
    mediaController.associateElement(external);
    assert(mediaController.associatedElementSubscriptions.has(external));

    external.dispatchEvent(new CustomEvent(MediaUIEvents.MEDIA_PLAY_REQUEST));
    assert.equal(uiRequests(store).length, 1);

    mediaController.unassociateElement(external);
    mediaController.unassociateElement(external);
    mediaController.unassociateElement(null);
    assert.isFalse(
      mediaController.associatedElementSubscriptions.has(external)
    );

    external.dispatchEvent(new CustomEvent(MediaUIEvents.MEDIA_PLAY_REQUEST));
    assert.equal(uiRequests(store).length, 1);
  });

  it('tears down store state owners on disconnect and restores subtitles on reconnect', async () => {
    const mediaController = await fixture<MediaController>(`
      <media-controller nodefaultstore>
        <video slot="media" muted>
          <track kind="subtitles" srclang="en" label="English">
        </video>
      </media-controller>
    `);
    const store = createFakeStore({
      mediaSubtitlesShowing: [{ kind: 'subtitles', language: 'en' }],
    });
    mediaController.mediaStore = store as any;
    const parent = mediaController.parentElement;

    mediaController.remove();
    assert.isNull(
      lastRequestOf(store, 'fullscreenelementchangerequest').detail ?? null
    );
    assert.isUndefined(
      lastRequestOf(store, 'documentelementchangerequest').detail
    );
    assert.isFalse(
      lastRequestOf(store, MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST).detail
    );
    assert(store.unsubscribe.calledOnce, 'unsubscribed on disconnect');

    // After disconnect, hotkeys are disabled
    const before = uiRequests(store).length;
    press(mediaController, 'k');
    assert.equal(uiRequests(store).length, before);

    parent.append(mediaController);
    assert(store.subscribe.calledTwice, 'resubscribed on reconnect');
    assert.equal(
      lastRequestOf(store, 'documentelementchangerequest').detail,
      document
    );
    await waitUntil(
      () =>
        lastRequestOf(store, MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST)
          ?.detail === true,
      'subtitles state restored'
    );
  });
});
