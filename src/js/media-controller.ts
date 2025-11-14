/*
  The <media-chrome> can contain the control elements
  and the media element. Features:
  * Auto-set the `media` attribute on child media chrome elements
    * Uses the element with slot="media"
  * Take custom controls to fullscreen
  * Position controls at the bottom
  * Auto-hide controls on inactivity while playing
*/
import { MediaContainer } from './media-container.js';
import { document, globalThis } from './utils/server-safe-globals.js';
import { MediaKeyboardShortcutsDialog } from './media-keyboard-shortcuts-dialog.js';
import { AttributeTokenList } from './utils/attribute-token-list.js';
import {
  delay,
  stringifyRenditionList,
  stringifyAudioTrackList,
} from './utils/utils.js';
import { stringifyTextTrackList } from './utils/captions.js';
import {
  MediaUIEvents,
  MediaUIAttributes,
  MediaStateReceiverAttributes,
  AttributeToStateChangeEventMap,
  MediaUIProps,
} from './constants.js';
import {
  getBooleanAttr,
  getNumericAttr,
  getStringAttr,
  setBooleanAttr,
  setNumericAttr,
  setStringAttr,
} from './utils/element-utils.js';
import { createMediaStore, MediaStore } from './media-store/media-store.js';
import { CustomElement } from './utils/CustomElement.js';
import { setLanguage } from './utils/i18n.js';

const ButtonPressedKeys = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Enter',
  ' ',
  'f',
  'm',
  'k',
  'c',
  'l',
  'j',
  '>',
  '<',
  'p',
];
const DEFAULT_SEEK_OFFSET = 10;
const DEFAULT_VOLUME_STEP = 0.025;
const DEFAULT_PLAYBACK_RATE_STEP = 0.25;
const MIN_PLAYBACK_RATE = 0.25;
const MAX_PLAYBACK_RATE = 2;

export const Attributes = {
  DEFAULT_SUBTITLES: 'defaultsubtitles',
  DEFAULT_STREAM_TYPE: 'defaultstreamtype',
  DEFAULT_DURATION: 'defaultduration',
  FULLSCREEN_ELEMENT: 'fullscreenelement',
  HOTKEYS: 'hotkeys',
  KEYBOARD_BACKWARD_SEEK_OFFSET: 'keyboardbackwardseekoffset',
  KEYBOARD_FORWARD_SEEK_OFFSET: 'keyboardforwardseekoffset',
  KEYBOARD_DOWN_VOLUME_STEP: 'keyboarddownvolumestep',
  KEYBOARD_UP_VOLUME_STEP: 'keyboardupvolumestep',
  KEYS_USED: 'keysused',
  LANG: 'lang',
  LOOP: 'loop',  
  LIVE_EDGE_OFFSET: 'liveedgeoffset',
  NO_AUTO_SEEK_TO_LIVE: 'noautoseektolive',
  NO_DEFAULT_STORE: 'nodefaultstore',
  NO_HOTKEYS: 'nohotkeys',
  NO_MUTED_PREF: 'nomutedpref',
  NO_SUBTITLES_LANG_PREF: 'nosubtitleslangpref',
  NO_VOLUME_PREF: 'novolumepref',
  SEEK_TO_LIVE_OFFSET: 'seektoliveoffset',
};

/**
 * Media Controller should not mimic the HTMLMediaElement API.
 * @see https://github.com/muxinc/media-chrome/pull/182#issuecomment-1067370339
 *
 * @attr {boolean} defaultsubtitles
 * @attr {string} defaultstreamtype
 * @attr {string} defaultduration
 * @attr {string} fullscreenelement
 * @attr {boolean} nohotkeys
 * @attr {string} hotkeys
 * @attr {string} keysused
 * @attr {string} liveedgeoffset
 * @attr {string} seektoliveoffset
 * @attr {boolean} noautoseektolive
 * @attr {boolean} novolumepref
 * @attr {boolean} nomutedpref
 * @attr {boolean} nosubtitleslangpref
 * @attr {boolean} nodefaultstore
 * @attr {string} lang
 */
class MediaController extends MediaContainer {
  static get observedAttributes() {
    return super.observedAttributes.concat(
      Attributes.NO_HOTKEYS,
      Attributes.HOTKEYS,
      Attributes.DEFAULT_STREAM_TYPE,
      Attributes.DEFAULT_SUBTITLES,
      Attributes.DEFAULT_DURATION,
      Attributes.NO_MUTED_PREF,
      Attributes.NO_VOLUME_PREF,
      Attributes.LANG,
      Attributes.LOOP
    );
  }

  mediaStateReceivers: HTMLElement[] = [];
  associatedElementSubscriptions: Map<HTMLElement, () => void> = new Map();

  #hotKeys = new AttributeTokenList(this, Attributes.HOTKEYS);
  #fullscreenElement: HTMLElement;
  #mediaStore: MediaStore;
  #keyboardShortcutsDialog: MediaKeyboardShortcutsDialog | null = null;
  #mediaStateCallback: (nextState: any) => void;
  #mediaStoreUnsubscribe: () => void;
  #mediaStateEventHandler = (event): void => {
    this.#mediaStore?.dispatch(event);
  };

  constructor() {
    super();

    // Track externally associated control elements

    this.associateElement(this);

    let prevState = {};
    this.#mediaStateCallback = (nextState: any): void => {
      Object.entries(nextState).forEach(([stateName, stateValue]) => {
        // Make sure to propagate initial state, even if still undefined (CJP)
        if (stateName in prevState && prevState[stateName] === stateValue)
          return;
        this.propagateMediaState(stateName, stateValue);
        const attrName = stateName.toLowerCase();
        const evt = new globalThis.CustomEvent(
          AttributeToStateChangeEventMap[attrName],
          { composed: true, detail: stateValue }
        );

        this.dispatchEvent(evt);
      });
      prevState = nextState;
    };

    this.hasAttribute(Attributes.NO_HOTKEYS)
      ? this.disableHotkeys()
      : this.enableHotkeys();
  }

  #setupDefaultStore() {
    this.mediaStore = createMediaStore({
      media: this.media,
      fullscreenElement: this.fullscreenElement,
      options: {
        defaultSubtitles: this.hasAttribute(Attributes.DEFAULT_SUBTITLES),
        defaultDuration: this.hasAttribute(Attributes.DEFAULT_DURATION)
          ? +this.getAttribute(Attributes.DEFAULT_DURATION)
          : undefined,
        defaultStreamType:
          /** @type {import('./media-store/state-mediator.js').StreamTypeValue} */ this.getAttribute(
            Attributes.DEFAULT_STREAM_TYPE
          ) ?? undefined,
        liveEdgeOffset: this.hasAttribute(Attributes.LIVE_EDGE_OFFSET)
          ? +this.getAttribute(Attributes.LIVE_EDGE_OFFSET)
          : undefined,
        seekToLiveOffset: this.hasAttribute(Attributes.SEEK_TO_LIVE_OFFSET)
          ? +this.getAttribute(Attributes.SEEK_TO_LIVE_OFFSET)
          : this.hasAttribute(Attributes.LIVE_EDGE_OFFSET)
          ? +this.getAttribute(Attributes.LIVE_EDGE_OFFSET)
          : undefined,
        noAutoSeekToLive: this.hasAttribute(Attributes.NO_AUTO_SEEK_TO_LIVE),
        // NOTE: This wasn't updated if it was changed later. Should it be? (CJP)
        noVolumePref: this.hasAttribute(Attributes.NO_VOLUME_PREF),
        noMutedPref: this.hasAttribute(Attributes.NO_MUTED_PREF),
        noSubtitlesLangPref: this.hasAttribute(
          Attributes.NO_SUBTITLES_LANG_PREF
        ),
      },
    });
  }

  get mediaStore(): MediaStore {
    return this.#mediaStore;
  }

  set mediaStore(value: MediaStore) {
    if (this.#mediaStore) {
      this.#mediaStoreUnsubscribe?.();
      this.#mediaStoreUnsubscribe = undefined;
    }
    this.#mediaStore = value;

    if (!this.#mediaStore && !this.hasAttribute(Attributes.NO_DEFAULT_STORE)) {
      this.#setupDefaultStore();
      return;
    }

    this.#mediaStoreUnsubscribe = this.#mediaStore?.subscribe(
      this.#mediaStateCallback
    );
  }

  get fullscreenElement(): HTMLElement {
    return this.#fullscreenElement ?? this;
  }

  set fullscreenElement(element: HTMLElement) {
    if (this.hasAttribute(Attributes.FULLSCREEN_ELEMENT)) {
      this.removeAttribute(Attributes.FULLSCREEN_ELEMENT);
    }
    this.#fullscreenElement = element;
    // Use the getter in case the fullscreen element was reset to "`this`"
    this.#mediaStore?.dispatch({
      type: 'fullscreenelementchangerequest',
      detail: this.fullscreenElement,
    });
  }

  get defaultSubtitles(): boolean | undefined {
    return getBooleanAttr(this, Attributes.DEFAULT_SUBTITLES);
  }

  set defaultSubtitles(value: boolean) {
    setBooleanAttr(this, Attributes.DEFAULT_SUBTITLES, value);
  }

  get defaultStreamType(): string | undefined {
    return getStringAttr(this, Attributes.DEFAULT_STREAM_TYPE);
  }

  set defaultStreamType(value: string | undefined) {
    setStringAttr(this, Attributes.DEFAULT_STREAM_TYPE, value);
  }

  get defaultDuration(): number | undefined {
    return getNumericAttr(this, Attributes.DEFAULT_DURATION);
  }

  set defaultDuration(value: number | undefined) {
    setNumericAttr(this, Attributes.DEFAULT_DURATION, value);
  }

  get noHotkeys(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_HOTKEYS);
  }

  set noHotkeys(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_HOTKEYS, value);
  }

  get keysUsed(): string | undefined {
    return getStringAttr(this, Attributes.KEYS_USED);
  }

  set keysUsed(value: string | undefined) {
    setStringAttr(this, Attributes.KEYS_USED, value);
  }

  get liveEdgeOffset(): number | undefined {
    return getNumericAttr(this, Attributes.LIVE_EDGE_OFFSET);
  }

  set liveEdgeOffset(value: number | undefined) {
    setNumericAttr(this, Attributes.LIVE_EDGE_OFFSET, value);
  }

  get noAutoSeekToLive(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_AUTO_SEEK_TO_LIVE);
  }

  set noAutoSeekToLive(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_AUTO_SEEK_TO_LIVE, value);
  }

  get noVolumePref(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_VOLUME_PREF);
  }

  set noVolumePref(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_VOLUME_PREF, value);
  }

  get noMutedPref(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_MUTED_PREF);
  }

  set noMutedPref(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_MUTED_PREF, value);
  }

  get noSubtitlesLangPref(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_SUBTITLES_LANG_PREF);
  }

  set noSubtitlesLangPref(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_SUBTITLES_LANG_PREF, value);
  }

  get noDefaultStore(): boolean | undefined {
    return getBooleanAttr(this, Attributes.NO_DEFAULT_STORE);
  }

  set noDefaultStore(value: boolean | undefined) {
    setBooleanAttr(this, Attributes.NO_DEFAULT_STORE, value);
  }

  attributeChangedCallback(
    attrName: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === Attributes.NO_HOTKEYS) {
      if (newValue !== oldValue && newValue === '') {
        if (this.hasAttribute(Attributes.HOTKEYS)) {
          console.warn(
            'Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled.'
          );
        }
        this.disableHotkeys();
      } else if (newValue !== oldValue && newValue === null) {
        this.enableHotkeys();
      }
    } else if (attrName === Attributes.HOTKEYS) {
      this.#hotKeys.value = newValue;
    } else if (
      attrName === Attributes.DEFAULT_SUBTITLES &&
      newValue !== oldValue
    ) {
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          defaultSubtitles: this.hasAttribute(Attributes.DEFAULT_SUBTITLES),
        },
      });
    } else if (attrName === Attributes.DEFAULT_STREAM_TYPE) {
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          defaultStreamType:
            this.getAttribute(Attributes.DEFAULT_STREAM_TYPE) ?? undefined,
        },
      });
    } else if (attrName === Attributes.LIVE_EDGE_OFFSET) {
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          liveEdgeOffset: this.hasAttribute(Attributes.LIVE_EDGE_OFFSET)
            ? +this.getAttribute(Attributes.LIVE_EDGE_OFFSET)
            : undefined,
          seekToLiveOffset: !this.hasAttribute(Attributes.SEEK_TO_LIVE_OFFSET)
            ? +this.getAttribute(Attributes.LIVE_EDGE_OFFSET)
            : undefined,
        },
      });
    } else if (attrName === Attributes.SEEK_TO_LIVE_OFFSET) {
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          seekToLiveOffset: this.hasAttribute(Attributes.SEEK_TO_LIVE_OFFSET)
            ? +this.getAttribute(Attributes.SEEK_TO_LIVE_OFFSET)
            : undefined,
        },
      });
    } else if (attrName === Attributes.NO_AUTO_SEEK_TO_LIVE) {
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          noAutoSeekToLive: this.hasAttribute(Attributes.NO_AUTO_SEEK_TO_LIVE),
        },
      });
    } else if (attrName === Attributes.FULLSCREEN_ELEMENT) {
      const el: HTMLElement = newValue
        ? (this.getRootNode() as Document)?.getElementById(newValue)
        : undefined;

      // NOTE: Setting the internal private prop here instead of using the setter to not
      // clear the attribute that was just set (CJP).
      this.#fullscreenElement = el;
      // Use the getter in case the fullscreen element was reset to "`this`"
      this.#mediaStore?.dispatch({
        type: 'fullscreenelementchangerequest',
        detail: this.fullscreenElement,
      });
    } else if (attrName === Attributes.LANG && newValue !== oldValue) {
      setLanguage(newValue);
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          mediaLang: newValue,
        },
      });
    } else if (attrName === Attributes.LOOP && newValue !== oldValue) {
      this.#mediaStore?.dispatch({
        type: MediaUIEvents.MEDIA_LOOP_REQUEST,
        detail: newValue != null,
      });
    } else if (attrName === Attributes.NO_VOLUME_PREF && newValue !== oldValue) {
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          noVolumePref: this.hasAttribute(Attributes.NO_VOLUME_PREF),
        },
      });
    } else if (attrName === Attributes.NO_MUTED_PREF && newValue !== oldValue) {
      this.#mediaStore?.dispatch({
        type: 'optionschangerequest',
        detail: {
          noMutedPref: this.hasAttribute(Attributes.NO_MUTED_PREF),
        },
      });
    }
  }

  connectedCallback(): void {
    // NOTE: Need to defer default MediaStore creation until connected for use cases that
    // rely on createElement('media-controller') (like many frameworks "under the hood") (CJP).
    if (!this.#mediaStore && !this.hasAttribute(Attributes.NO_DEFAULT_STORE)) {
      this.#setupDefaultStore();
    }

    this.#mediaStore?.dispatch({
      type: 'documentelementchangerequest',
      detail: document,
    });

    // mediaSetCallback() is called in super.connectedCallback();
    super.connectedCallback();

    if (this.#mediaStore && !this.#mediaStoreUnsubscribe) {
      this.#mediaStoreUnsubscribe = this.#mediaStore?.subscribe(
        this.#mediaStateCallback
      );
    }

    this.hasAttribute(Attributes.NO_HOTKEYS)
      ? this.disableHotkeys()
      : this.enableHotkeys();
  }

  disconnectedCallback(): void {
    // mediaUnsetCallback() is called in super.disconnectedCallback();
    super.disconnectedCallback?.();

    if (this.#mediaStore) {
      this.#mediaStore?.dispatch({
        type: 'documentelementchangerequest',
        detail: undefined,
      });
      /** @TODO Revisit: may not be necessary anymore or better solved via unsubscribe behavior? (CJP) */
      // Disable captions on disconnect to prevent a memory leak if they stay enabled.
      this.#mediaStore?.dispatch({
        type: MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST,
        detail: false,
      });
    }

    if (this.#mediaStoreUnsubscribe) {
      this.#mediaStoreUnsubscribe?.();
      this.#mediaStoreUnsubscribe = undefined;
    }
  }

  /**
   * @override
   * @param {HTMLMediaElement} media
   */
  mediaSetCallback(media: HTMLMediaElement) {
    super.mediaSetCallback(media);
    this.#mediaStore?.dispatch({
      type: 'mediaelementchangerequest',
      detail: media,
    });

    // TODO: What does this do? At least add comment, maybe move to media-container
    if (!media.hasAttribute('tabindex')) {
      media.tabIndex = -1;
    }
  }

  /**
   * @override
   * @param {HTMLMediaElement} media
   */
  mediaUnsetCallback(media: HTMLMediaElement) {
    super.mediaUnsetCallback(media);
    this.#mediaStore?.dispatch({
      type: 'mediaelementchangerequest',
      detail: undefined,
    });
  }

  propagateMediaState(stateName: string, state: any) {
    propagateMediaState(this.mediaStateReceivers, stateName, state);
  }

  associateElement(element: HTMLElement) {
    if (!element) return;
    const { associatedElementSubscriptions } = this;

    if (associatedElementSubscriptions.has(element)) return;

    const registerMediaStateReceiver =
      this.registerMediaStateReceiver.bind(this);
    const unregisterMediaStateReceiver =
      this.unregisterMediaStateReceiver.bind(this);

    /** @TODO Should we support "removing association" */
    const unsubscribe = monitorForMediaStateReceivers(
      element,
      registerMediaStateReceiver,
      unregisterMediaStateReceiver
    );

    // Add all media request event listeners to the Associated Element. This allows any DOM element that
    // is a descendant of any Associated Element (including the <media-controller/> itself) to make requests
    // for media state changes rather than constraining that exclusively to a Media State Receivers.
    // Still generically setup events -> mediaStore dispatch, since it will
    // forward the events on to whichever store is defined (CJP)
    Object.values(MediaUIEvents).forEach((eventName) => {
      element.addEventListener(eventName, this.#mediaStateEventHandler);
    });

    associatedElementSubscriptions.set(element, unsubscribe);
  }

  unassociateElement(element: HTMLElement) {
    if (!element) return;
    const { associatedElementSubscriptions } = this;
    if (!associatedElementSubscriptions.has(element)) return;
    const unsubscribe = associatedElementSubscriptions.get(element);
    unsubscribe();
    associatedElementSubscriptions.delete(element);

    // Remove all media UI event listeners
    Object.values(MediaUIEvents).forEach((eventName) => {
      element.removeEventListener(eventName, this.#mediaStateEventHandler);
    });
  }

  registerMediaStateReceiver(el: HTMLElement) {
    if (!el) return;
    const els = this.mediaStateReceivers;
    const index = els.indexOf(el);
    if (index > -1) return;

    els.push(el);

    if (this.#mediaStore) {
      Object.entries(this.#mediaStore.getState()).forEach(
        ([stateName, stateValue]) => {
          propagateMediaState([el], stateName, stateValue);
        }
      );
    }
  }

  unregisterMediaStateReceiver(el: HTMLElement) {
    const els = this.mediaStateReceivers;

    const index = els.indexOf(el);
    if (index < 0) return;

    els.splice(index, 1);
  }

  #keyUpHandler(e: KeyboardEvent) {
    const { key, shiftKey } = e;
    // Check for Shift + / (which produces '?' on US keyboards or '/' on others)
    const isShiftSlash = shiftKey && (key === '/' || key === '?');
    const shouldHandle = isShiftSlash || ButtonPressedKeys.includes(key);
    if (!shouldHandle) {
      this.removeEventListener('keyup', this.#keyUpHandler);
      return;
    }

    this.keyboardShortcutHandler(e);
  }

  #keyDownHandler(e: KeyboardEvent) {
    const { metaKey, altKey, key, shiftKey } = e;
    // Check for Shift + / (which produces '?' on US keyboards or '/' on others)
    const isShiftSlash = shiftKey && (key === '/' || key === '?');
    // If dialog is open, remove keyup handler - the dialog will handle closing itself
    if (isShiftSlash && this.#keyboardShortcutsDialog?.open) {
      this.removeEventListener('keyup', this.#keyUpHandler);
      return;
    }
    
    if (metaKey || altKey || (!isShiftSlash && !ButtonPressedKeys.includes(key))) {
      this.removeEventListener('keyup', this.#keyUpHandler);
      return;
    }

    const target = e.target;
    const isRangeInput =
      target instanceof HTMLElement &&
      (target.tagName.toLowerCase() === 'media-volume-range' ||
        target.tagName.toLowerCase() === 'media-time-range');

    // if the pressed key might move the page, we need to preventDefault on keydown
    // because doing so on keyup is too late
    // We also want to make sure that the hotkey hasn't been turned off before doing so
    if (
      [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key) &&
      !(
        this.#hotKeys.contains(`no${key.toLowerCase()}`) ||
        (key === ' ' && this.#hotKeys.contains('nospace'))
      ) &&
      !isRangeInput // Only preventDefault if a range input is NOT selected
    ) {
      e.preventDefault();
    }

    this.addEventListener('keyup', this.#keyUpHandler, { once: true });
  }

  enableHotkeys() {
    this.addEventListener('keydown', this.#keyDownHandler);
  }

  disableHotkeys() {
    this.removeEventListener('keydown', this.#keyDownHandler);
    this.removeEventListener('keyup', this.#keyUpHandler);
  }

  get hotkeys(): string | undefined {
    return getStringAttr(this, Attributes.HOTKEYS);
  }

  set hotkeys(value: string | undefined) {
    setStringAttr(this, Attributes.HOTKEYS, value);
  }

  keyboardShortcutHandler(e: KeyboardEvent) {
    // TODO: e.target might need to be replaced w/ e.composedPath to account for shadow DOM.
    // if the event's key is already handled by the target, skip keyboard shortcuts
    // keysUsed is either an attribute or a property.
    // The attribute is a DOM array and the property is a JS array
    // In the attribute Space represents the space key and gets convered to ' '
    const target = e.target as any;
    const keysUsed = (
      target.getAttribute(Attributes.KEYS_USED)?.split(' ') ??
      target?.keysUsed ??
      []
    )
      .map((key) => (key === 'Space' ? ' ' : key))
      .filter(Boolean);

    if (keysUsed.includes(e.key)) {
      return;
    }

    let eventName, detail, evt;
    // if the blocklist contains the key, skip handling it.
    if (this.#hotKeys.contains(`no${e.key.toLowerCase()}`)) return;
    if (e.key === ' ' && this.#hotKeys.contains(`nospace`)) return;

    const isShiftSlash = e.shiftKey && (e.key === '/' || e.key === '?');
    if (isShiftSlash && this.#hotKeys.contains('noshift+/')) return;

    // These event triggers were copied from the revelant buttons
    switch (e.key) {
      case ' ':
      case 'k':
        eventName = this.#mediaStore.getState().mediaPaused
          ? MediaUIEvents.MEDIA_PLAY_REQUEST
          : MediaUIEvents.MEDIA_PAUSE_REQUEST;
        this.dispatchEvent(
          new globalThis.CustomEvent(eventName, {
            composed: true,
            bubbles: true,
          })
        );
        break;

      case 'm':
        eventName =
          this.mediaStore.getState().mediaVolumeLevel === 'off'
            ? MediaUIEvents.MEDIA_UNMUTE_REQUEST
            : MediaUIEvents.MEDIA_MUTE_REQUEST;
        this.dispatchEvent(
          new globalThis.CustomEvent(eventName, {
            composed: true,
            bubbles: true,
          })
        );
        break;

      case 'f':
        eventName = this.mediaStore.getState().mediaIsFullscreen
          ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
          : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
        this.dispatchEvent(
          new globalThis.CustomEvent(eventName, {
            composed: true,
            bubbles: true,
          })
        );
        break;

      case 'c':
        this.dispatchEvent(
          new globalThis.CustomEvent(
            MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST,
            { composed: true, bubbles: true }
          )
        );
        break;

      case 'ArrowLeft':
      case 'j': {
        const offsetValue = this.hasAttribute(
          Attributes.KEYBOARD_BACKWARD_SEEK_OFFSET
        )
          ? +this.getAttribute(Attributes.KEYBOARD_BACKWARD_SEEK_OFFSET)
          : DEFAULT_SEEK_OFFSET;
        detail = Math.max(
          (this.mediaStore.getState().mediaCurrentTime ?? 0) - offsetValue,
          0
        );
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;
      }

      case 'ArrowRight':
      case 'l': {
        const offsetValue = this.hasAttribute(
          Attributes.KEYBOARD_FORWARD_SEEK_OFFSET
        )
          ? +this.getAttribute(Attributes.KEYBOARD_FORWARD_SEEK_OFFSET)
          : DEFAULT_SEEK_OFFSET;
        detail = Math.max(
          (this.mediaStore.getState().mediaCurrentTime ?? 0) + offsetValue,
          0
        );
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;
      }

      case 'ArrowUp': {
        const step = this.hasAttribute(Attributes.KEYBOARD_UP_VOLUME_STEP)
          ? +this.getAttribute(Attributes.KEYBOARD_UP_VOLUME_STEP)
          : DEFAULT_VOLUME_STEP;
        detail = Math.min(
          (this.mediaStore.getState().mediaVolume ?? 1) + step,
          1
        );
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_VOLUME_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;
      }

      case 'ArrowDown': {
        const step = this.hasAttribute(Attributes.KEYBOARD_DOWN_VOLUME_STEP)
          ? +this.getAttribute(Attributes.KEYBOARD_DOWN_VOLUME_STEP)
          : DEFAULT_VOLUME_STEP;
        detail = Math.max(
          (this.mediaStore.getState().mediaVolume ?? 1) - step,
          0
        );
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_VOLUME_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;
      }

      case '<': {
        const playbackRate = this.mediaStore.getState().mediaPlaybackRate ?? 1;
        detail = Math.max(
          playbackRate - DEFAULT_PLAYBACK_RATE_STEP,
          MIN_PLAYBACK_RATE
        ).toFixed(2);
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;
      }

      case '>': {
        const playbackRate = this.mediaStore.getState().mediaPlaybackRate ?? 1;
        detail = Math.min(
          playbackRate + DEFAULT_PLAYBACK_RATE_STEP,
          MAX_PLAYBACK_RATE
        ).toFixed(2);
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;
      }

      case '/':
      case '?': {
        // Check if Shift is pressed for Shift + /
        if (e.shiftKey) {
          this.#showKeyboardShortcutsDialog();
        }
        break;
      }

      case 'p': {
        eventName = this.mediaStore.getState().mediaIsPip
          ? MediaUIEvents.MEDIA_EXIT_PIP_REQUEST
          : MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
        evt = new globalThis.CustomEvent(eventName, {
          composed: true,
          bubbles: true,
        });
        this.dispatchEvent(evt);
        break;
      }
      default:
        break;
    }
  }

  #showKeyboardShortcutsDialog() {
    if (!this.#keyboardShortcutsDialog) {
      this.#keyboardShortcutsDialog = document.createElement(
        'media-keyboard-shortcuts-dialog'
      ) as MediaKeyboardShortcutsDialog;
      this.appendChild(this.#keyboardShortcutsDialog);
    }
    this.#keyboardShortcutsDialog.open = true;
  }
}

const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);
const MEDIA_UI_PROP_NAMES = Object.values(MediaUIProps);

const getMediaUIAttributesFrom = (child: HTMLElement): string[] => {
  let { observedAttributes } = child.constructor as typeof CustomElement;

  // observedAttributes are only available if the custom element was upgraded.
  // example: media-gesture-receiver in the shadow DOM requires an upgrade.
  if (!observedAttributes && child.nodeName?.includes('-')) {
    globalThis.customElements.upgrade(child);
    ({ observedAttributes } = child.constructor as typeof CustomElement);
  }

  const mediaChromeAttributesList = child
    ?.getAttribute?.(MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES)
    ?.split?.(/\s+/);
  if (!Array.isArray(observedAttributes || mediaChromeAttributesList))
    return [];
  return (observedAttributes || mediaChromeAttributesList).filter((attrName) =>
    MEDIA_UI_ATTRIBUTE_NAMES.includes(attrName)
  );
};

const hasMediaUIProps = (mediaStateReceiverCandidate: HTMLElement): boolean => {
  if (
    mediaStateReceiverCandidate.nodeName?.includes('-') &&
    !!globalThis.customElements.get(
      mediaStateReceiverCandidate.nodeName?.toLowerCase()
    ) &&
    !(
      mediaStateReceiverCandidate instanceof
      globalThis.customElements.get(
        mediaStateReceiverCandidate.nodeName.toLowerCase()
      )
    )
  ) {
    globalThis.customElements.upgrade(mediaStateReceiverCandidate);
  }
  return MEDIA_UI_PROP_NAMES.some(
    (propName) => propName in mediaStateReceiverCandidate
  );
};

const isMediaStateReceiver = (child: HTMLElement): boolean => {
  return hasMediaUIProps(child) || !!getMediaUIAttributesFrom(child).length;
};

const serializeTuple = (tuple: any[]): string | undefined => tuple?.join?.(':');

const CustomAttrSerializer: Record<string, (value: any) => string> = {
  [MediaUIAttributes.MEDIA_SUBTITLES_LIST]: stringifyTextTrackList,
  [MediaUIAttributes.MEDIA_SUBTITLES_SHOWING]: stringifyTextTrackList,
  [MediaUIAttributes.MEDIA_SEEKABLE]: serializeTuple,
  [MediaUIAttributes.MEDIA_BUFFERED]: (tuples: any[][]): string =>
    tuples?.map(serializeTuple).join(' '),
  [MediaUIAttributes.MEDIA_PREVIEW_COORDS]: (coords: number[]): string =>
    coords?.join(' '),
  [MediaUIAttributes.MEDIA_RENDITION_LIST]: stringifyRenditionList,
  [MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST]: stringifyAudioTrackList,
};

const setAttr = async (
  child: HTMLElement,
  attrName: string,
  attrValue: any
): Promise<void> => {
  // If the node is not connected to the DOM yet wait on macrotask. Fix for:
  //   Uncaught DOMException: Failed to construct 'CustomElement':
  //   The result must not have attributes
  if (!child.isConnected) {
    await delay(0);
  }

  // NOTE: For "nullish" (null/undefined), can use any setter
  if (typeof attrValue === 'boolean' || attrValue == null) {
    return setBooleanAttr(child, attrName, attrValue);
  }
  if (typeof attrValue === 'number') {
    return setNumericAttr(child, attrName, attrValue);
  }
  if (typeof attrValue === 'string') {
    return setStringAttr(child, attrName, attrValue);
  }
  // Treat empty arrays as "nothing" values
  if (Array.isArray(attrValue) && !attrValue.length) {
    return child.removeAttribute(attrName);
  }

  // For "special" values with custom serializers or all other values
  const val = CustomAttrSerializer[attrName]?.(attrValue) ?? attrValue;
  return child.setAttribute(attrName, val);
};

const isMediaSlotElementDescendant = (el: HTMLElement): boolean =>
  !!el.closest?.('*[slot="media"]');

/**
 *
 * @description This function will recursively check for any descendants (including the rootNode)
 * that are Media State Receivers and invoke `mediaStateReceiverCallback` with any Media State Receiver
 * found
 *
 * @param {HTMLElement} rootNode
 * @param {function} mediaStateReceiverCallback
 */
const traverseForMediaStateReceivers = (
  rootNode: HTMLElement,
  mediaStateReceiverCallback: (element: HTMLElement) => void
): void => {
  // We (currently) don't check if descendants of the `media` (e.g. <video/>) are Media State Receivers
  // See also: `propagateMediaState`
  if (isMediaSlotElementDescendant(rootNode)) {
    return;
  }

  const traverseForMediaStateReceiversSync = (
    rootNode: HTMLElement,
    mediaStateReceiverCallback: (element: HTMLElement) => void
  ): void => {
    // The rootNode is itself a Media State Receiver
    if (isMediaStateReceiver(rootNode)) {
      mediaStateReceiverCallback(rootNode);
    }

    const { children = [] } = rootNode ?? {};
    const shadowChildren = rootNode?.shadowRoot?.children ?? [];
    const allChildren = [...children, ...shadowChildren];

    // Traverse all children (including shadowRoot children) to see if they are/have Media State Receivers
    allChildren.forEach((child) =>
      traverseForMediaStateReceivers(
        child as HTMLElement,
        mediaStateReceiverCallback
      )
    );
  };

  // Custom Elements (and *only* Custom Elements) must have a hyphen ("-") in their name. So, if the rootNode is
  // a custom element (aka has a hyphen in its name), wait until it's defined before attempting traversal to determine
  // whether or not it or its descendants are Media State Receivers.
  // IMPORTANT NOTE: We're intentionally *always* waiting for the `whenDefined()` Promise to resolve here
  // (instead of using `globalThis.customElements.get(name)` to check if a custom element is already defined/registered)
  // because we encountered some reliability issues with the custom element instances not being fully "ready", even if/when
  // they are available in the registry via `globalThis.customElements.get(name)`.
  const name = rootNode?.nodeName.toLowerCase();
  if (name.includes('-') && !isMediaStateReceiver(rootNode)) {
    globalThis.customElements.whenDefined(name).then(() => {
      // Try/traverse again once the custom element is defined
      traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
    });
    return;
  }

  traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
};

const propagateMediaState = (
  els: HTMLElement[],
  stateName: string,
  val: any
): void => {
  els.forEach((el) => {
    if (stateName in el) {
      el[stateName] = val;
      return;
    }
    const relevantAttrs = getMediaUIAttributesFrom(el);
    const attrName = stateName.toLowerCase();
    if (!relevantAttrs.includes(attrName)) return;
    setAttr(el, attrName, val);
  });
};

/**
 *
 * @description This function will monitor the rootNode for any Media State Receiver descendants
 * that are already present, added, or removed, invoking the relevant callback function for each
 * case.
 *
 * @param {HTMLElement} rootNode
 * @param {function} registerMediaStateReceiver
 * @param {function} unregisterMediaStateReceiver
 * @returns An unsubscribe method, used to stop monitoring descendants of rootNode and to unregister its descendants
 *
 */
const monitorForMediaStateReceivers = (
  rootNode: HTMLElement,
  registerMediaStateReceiver: (el: HTMLElement) => void,
  unregisterMediaStateReceiver: (el: HTMLElement) => void
): (() => void) => {
  // First traverse the tree to register any current Media State Receivers
  traverseForMediaStateReceivers(rootNode, registerMediaStateReceiver);

  // Monitor for any event-based requests from descendants to register/unregister as a Media State Receiver
  const registerMediaStateReceiverHandler = (evt: Event) => {
    const el = evt?.composedPath()[0] ?? evt.target;
    registerMediaStateReceiver(el as HTMLElement);
  };

  const unregisterMediaStateReceiverHandler = (evt: Event) => {
    const el = evt?.composedPath()[0] ?? evt.target;
    unregisterMediaStateReceiver(el as HTMLElement);
  };

  rootNode.addEventListener(
    MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER,
    registerMediaStateReceiverHandler
  );
  rootNode.addEventListener(
    MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER,
    unregisterMediaStateReceiverHandler
  );

  // Observe any changes to the DOM for any descendants that are identifiable as Media State Receivers
  // and register or unregister them, depending on the change that occurred.
  const mutationCallback = (mutationsList: MutationRecord[]) => {
    mutationsList.forEach((mutationRecord) => {
      const {
        addedNodes = [],
        removedNodes = [],
        type,
        target,
        attributeName,
      } = mutationRecord;
      if (type === 'childList') {
        // For each added node, register any Media State Receiver descendants (including itself)
        Array.prototype.forEach.call(addedNodes, (node) =>
          traverseForMediaStateReceivers(
            node as HTMLElement,
            registerMediaStateReceiver
          )
        );
        // For each removed node, unregister any Media State Receiver descendants (including itself)
        Array.prototype.forEach.call(removedNodes, (node) =>
          traverseForMediaStateReceivers(
            node as HTMLElement,
            unregisterMediaStateReceiver
          )
        );
      } else if (
        type === 'attributes' &&
        attributeName === MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES
      ) {
        if (isMediaStateReceiver(target as HTMLElement)) {
          // Changed from a "non-Media State Receiver" to a Media State Receiver: register it.
          registerMediaStateReceiver(target as HTMLElement);
        } else {
          // Changed from a Media State Receiver to a "non-Media State Receiver": unregister it.
          unregisterMediaStateReceiver(target as HTMLElement);
        }
      }
    });
  };

  // Storing prevSlotted elements so we can cleanup if slotted elements change over time.
  let prevSlotted: HTMLElement[] = [];
  const slotChangeHandler = (event: Event) => {
    const slotEl = event.target as HTMLSlotElement;
    if (slotEl.name === 'media') return;
    prevSlotted.forEach((node) =>
      traverseForMediaStateReceivers(node, unregisterMediaStateReceiver)
    );
    prevSlotted = [
      ...slotEl.assignedElements({ flatten: true }),
    ] as HTMLElement[];
    prevSlotted.forEach((node) =>
      traverseForMediaStateReceivers(node, registerMediaStateReceiver)
    );
  };
  rootNode.addEventListener('slotchange', slotChangeHandler);

  const observer = new MutationObserver(mutationCallback);
  observer.observe(rootNode, {
    childList: true,
    attributes: true,
    subtree: true,
  });

  const unsubscribe = () => {
    // Unregister any Media State Receiver descendants (including ourselves)
    traverseForMediaStateReceivers(rootNode, unregisterMediaStateReceiver);
    // Make sure we remove the slotchange event listener
    rootNode.removeEventListener('slotchange', slotChangeHandler);
    // Stop observing for Media State Receivers
    observer.disconnect();
    // Stop listening for Media State Receiver events.
    rootNode.removeEventListener(
      MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER,
      registerMediaStateReceiverHandler
    );
    rootNode.removeEventListener(
      MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER,
      unregisterMediaStateReceiverHandler
    );
  };

  return unsubscribe;
};

if (!globalThis.customElements.get('media-controller')) {
  globalThis.customElements.define('media-controller', MediaController);
}

export { MediaController };
export default MediaController;
