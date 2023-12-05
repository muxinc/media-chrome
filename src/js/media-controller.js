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
import { globalThis } from './utils/server-safe-globals.js';
import { AttributeTokenList } from './utils/attribute-token-list.js';
import { constToCamel, delay, stringifyRenditionList, stringifyAudioTrackList } from './utils/utils.js';
import { stringifyTextTrackList } from './utils/captions.js';
import {
  MediaUIEvents,
  MediaUIAttributes,
  MediaStateReceiverAttributes,
  AttributeToStateChangeEventMap,
  MediaUIProps,
} from './constants.js';
import { MediaUIRequestHandlers, MediaUIStates, volumeSupportPromise } from './controller.js';
import { setBooleanAttr, setNumericAttr, setStringAttr } from './utils/element-utils.js';

const ButtonPressedKeys = ['ArrowLeft', 'ArrowRight', 'Enter', ' ', 'f', 'm', 'k', 'c'];
const DEFAULT_SEEK_OFFSET = 10;
const DEFAULT_TIME = 0;

export const Attributes = {
  DEFAULT_SUBTITLES: 'defaultsubtitles',
  DEFAULT_STREAM_TYPE: 'defaultstreamtype',
  DEFAULT_DURATION: 'defaultduration',
  FULLSCREEN_ELEMENT: 'fullscreenelement',
  HOTKEYS: 'hotkeys',
  KEYS_USED: 'keysused',
  LIVE_EDGE_OFFSET: 'liveedgeoffset',
  NO_AUTO_SEEK_TO_LIVE: 'noautoseektolive',
  NO_HOTKEYS: 'nohotkeys',
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
 * @attr {boolean} noautoseektolive
 */
class MediaController extends MediaContainer {
  static get observedAttributes() {
    return super.observedAttributes.concat(
      Attributes.NO_HOTKEYS,
      Attributes.HOTKEYS,
      Attributes.DEFAULT_STREAM_TYPE,
      Attributes.DEFAULT_SUBTITLES,
      Attributes.DEFAULT_DURATION,
    );
  }

  #hotKeys = new AttributeTokenList(this, Attributes.HOTKEYS);
  #fullscreenElement;
  /** @type {HTMLDocument|ShadowRoot} */
  #rootNode;

  constructor() {
    super();

    // Update volume support ASAP
    if (MediaUIStates.MEDIA_VOLUME_UNAVAILABLE.get(this) === undefined) {
      // NOTE: In order to propagate ASAP, we currently need to ensure that
      // the volume support promise has resolved. Given the async nature of
      // some of these environment state values, we may want to model this
      // a bit better (CJP).
      volumeSupportPromise.then(() => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE,
          MediaUIStates.MEDIA_VOLUME_UNAVAILABLE.get(this)
        );
      });
    }

    // Track externally associated control elements
    this.mediaStateReceivers = [];
    this.associatedElementSubscriptions = new Map();
    this.associateElement(this);

    // Apply ui event listeners to self
    // Should apply to any UI container, not just controller
    Object.keys(MediaUIRequestHandlers).forEach((key) => {
      const handlerName = `_handle${constToCamel(key, true)}`;

      // TODO: Move to map, not obj root property
      this[handlerName] = (e) => {
        // Stop media UI events from continuing to bubble
        e.stopPropagation();

        if (!this.media) {
          console.warn('MediaController: No media available.');
          return;
        }

        MediaUIRequestHandlers[key](this.media, e, this);
      };
      this.addEventListener(MediaUIEvents[key], this[handlerName]);
    });

    // Build event listeners for media states
    this._mediaStatePropagators = {};
    Object.keys(MediaUIStates).forEach((key) => {
      this._mediaStatePropagators[key] = e => {
        this.propagateMediaState(MediaUIProps[key], MediaUIStates[key].get(this, e));
      };
    });
  }

  get fullscreenElement() {
    return this.#fullscreenElement ?? this;
  }

  set fullscreenElement(element) {
    if (this.hasAttribute(Attributes.FULLSCREEN_ELEMENT)) {
      this.removeAttribute(Attributes.FULLSCREEN_ELEMENT);
    }
    this.#fullscreenElement = element;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    super.attributeChangedCallback(attrName, oldValue, newValue);

    if (attrName === Attributes.NO_HOTKEYS) {
      if (newValue !== oldValue && newValue === '') {
        if (this.hasAttribute(Attributes.HOTKEYS)) {
          console.warn('Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled.');
        }
        this.disableHotkeys();

      } else if (newValue !== oldValue && newValue === null) {
        this.enableHotkeys();
      }
    } else if (attrName === Attributes.HOTKEYS) {
        this.#hotKeys.value = newValue;

    } else if (
      attrName === Attributes.DEFAULT_SUBTITLES &&
      newValue !== oldValue &&
      newValue === ''
    ) {
      this.dispatchEvent(
        new globalThis.CustomEvent(
          MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST,
          { composed: true, bubbles: true, detail: true }
        )
      );

    } else if (attrName === Attributes.DEFAULT_STREAM_TYPE) {
      this.propagateMediaState(MediaUIProps.MEDIA_STREAM_TYPE);

    } else if (attrName === Attributes.FULLSCREEN_ELEMENT) {
      const el = newValue ? this.#rootNode?.getElementById(newValue) : undefined;
      // NOTE: Setting the internal private prop here to not
      // clear the attribute that was just set (CJP).
      this.#fullscreenElement = el;
    }
  }

  connectedCallback() {
    // mediaSetCallback() is called in super.connectedCallback();
    super.connectedCallback();

    // getRootNode() in disconnectedCallback returns the media-controller element itself
    // but we need the HTMLDocument or ShadowRoot if media-controller is in a shadow DOM.
    // We store the correct root node here so we can access it later.
    this.#rootNode = /** @type HTMLDocument | ShadowRoot */ (this.getRootNode());

    this.enableHotkeys();
  }

  disconnectedCallback() {
    // mediaUnsetCallback() is called in super.disconnectedCallback();
    super.disconnectedCallback();
    this.disableHotkeys();

    // Disable captions on disconnect to prevent a memory leak if they stay enabled.
    this.dispatchEvent(
      new globalThis.CustomEvent(
        MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST,
        { composed: true, bubbles: true, detail: false }
      )
    );
  }

  /**
   * @override
   * @param {HTMLMediaElement} media
   */
  mediaSetCallback(media) {
    super.mediaSetCallback(media);

    // TODO: What does this do? At least add comment, maybe move to media-container
    if (!media.hasAttribute('tabindex')) {
      media.tabIndex = -1;
    }

    // Listen for media state changes and propagate them to children and associated els
    Object.keys(MediaUIStates).forEach((key) => {
      const {
        mediaEvents,
        rootEvents,
        textTracksEvents,
        videoRenditionsEvents,
        audioTracksEvents,
      } = MediaUIStates[key];

      const handler = this._mediaStatePropagators[key];

      mediaEvents?.forEach((eventName) => {
        media.addEventListener(eventName, handler);
        handler();
      });

      rootEvents?.forEach((eventName) => {
        this.#rootNode?.addEventListener(eventName, handler);
        handler();
      });

      textTracksEvents?.forEach((eventName) => {
        media.textTracks?.addEventListener(eventName, handler);
        handler();
      });

      videoRenditionsEvents?.forEach((eventName) => {
        // @ts-ignore
        media.videoRenditions?.addEventListener(eventName, handler);
        handler();
      });

      audioTracksEvents?.forEach((eventName) => {
        // @ts-ignore
        media.audioTracks?.addEventListener(eventName, handler);
        handler();
      });
    });

    // don't get from localStorage if novolumepref attribute is set
    if (!this.hasAttribute('novolumepref')) {
      // Update the media with the last set volume preference
      // This would preferably live with the media element, not a control.
      try {
        const volPref = globalThis.localStorage.getItem('media-chrome-pref-volume');
        if (volPref !== null) media.volume = volPref;
      } catch (e) {
        console.debug('Error getting volume pref', e);
      }
    }
  }

  /**
   * @override
   * @param {HTMLMediaElement} media
   */
  mediaUnsetCallback(media) {
    super.mediaUnsetCallback(media);

    // Remove all state change propagators
    Object.keys(MediaUIStates).forEach((key) => {
      const {
        mediaEvents,
        rootEvents,
        textTracksEvents,
        videoRenditionsEvents,
        audioTracksEvents,
      } = MediaUIStates[key];

      const handler = this._mediaStatePropagators[key];

      mediaEvents?.forEach((eventName) => {
        media.removeEventListener(eventName, handler);
      });

      rootEvents?.forEach((eventName) => {
        this.#rootNode?.removeEventListener(eventName, handler);
      });

      textTracksEvents?.forEach((eventName) => {
        media.textTracks?.removeEventListener(eventName, handler);
      });

      videoRenditionsEvents?.forEach((eventName) => {
        // @ts-ignore
        media.videoRenditions?.removeEventListener(eventName, handler);
        handler();
      });

      audioTracksEvents?.forEach((eventName) => {
        // @ts-ignore
        media.audioTracks?.removeEventListener(eventName, handler);
        handler();
      });
    });

    // Reset to paused state
    // TODO: Can we just reset all state here?
    // Should hasPlayed refer to the media element or the controller?
    // i.e. the poster might re-show if not handled by the poster el
    this.propagateMediaState(MediaUIProps.MEDIA_PAUSED, true);
  }

  propagateMediaState(stateName, state) {
    const previousState = getStateValue(this.mediaStateReceivers, stateName);

    propagateMediaState(this.mediaStateReceivers, stateName, state);

    if (previousState === getStateValue(this.mediaStateReceivers, stateName)) return;

    const attrName = stateName.toLowerCase();
    // TODO: I don't think we want these events to bubble? Video element states don't. (heff)
    const evt = new globalThis.CustomEvent(
      AttributeToStateChangeEventMap[attrName],
      { composed: true, bubbles: true, detail: state }
    );
    this.dispatchEvent(evt);
  }

  associateElement(element) {
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
    Object.keys(MediaUIEvents).forEach((key) => {
      element.addEventListener(
        MediaUIEvents[key],
        this[`_handle${constToCamel(key, true)}`]
      );
    });

    associatedElementSubscriptions.set(element, unsubscribe);
  }

  unassociateElement(element) {
    if (!element) return;
    const { associatedElementSubscriptions } = this;
    if (!associatedElementSubscriptions.has(element)) return;
    const unsubscribe = associatedElementSubscriptions.get(element);
    unsubscribe();
    associatedElementSubscriptions.delete(element);

    // Remove all media UI event listeners
    Object.keys(MediaUIEvents).forEach((key) => {
      element.removeEventListener(
        MediaUIEvents[key],
        this[`_handle${constToCamel(key, true)}`]
      );
    });
  }

  registerMediaStateReceiver(el) {
    if (!el) return;
    const els = this.mediaStateReceivers;
    const index = els.indexOf(el);
    if (index > -1) return;

    els.push(el);

    Object.keys(MediaUIStates).forEach((stateConstName)=>{
      const stateDetails = MediaUIStates[stateConstName];

      propagateMediaState(
        [el],
        MediaUIProps[stateConstName],
        stateDetails.get(this)
      );
    });
  }

  unregisterMediaStateReceiver(el) {
    const els = this.mediaStateReceivers;

    const index = els.indexOf(el);
    if (index < 0) return;

    els.splice(index, 1);
  }

  #keyUpHandler(e) {
    const { key } = e;
    if (!ButtonPressedKeys.includes(key)) {
      this.removeEventListener('keyup', this.#keyUpHandler);
      return;
    }

    this.keyboardShortcutHandler(e);
  }

  #keyDownHandler(e) {
    const { metaKey, altKey, key } = e;
    if (metaKey || altKey || !ButtonPressedKeys.includes(key)) {
      this.removeEventListener('keyup', this.#keyUpHandler);
      return;
    }

    // if the pressed key might move the page, we need to preventDefault on keydown
    // because doing so on keyup is too late
    // We also want to make sure that the hotkey hasn't been turned off before doing so
    if (
      [' ', 'ArrowLeft', 'ArrowRight'].includes(key) &&
      !(this.#hotKeys.contains(`no${key.toLowerCase()}`) ||
        key === ' ' && this.#hotKeys.contains('nospace'))
    ) {
      e.preventDefault();
    }

    this.addEventListener('keyup', this.#keyUpHandler, {once: true});
  }

  enableHotkeys() {
    this.addEventListener('keydown', this.#keyDownHandler);
  }

  disableHotkeys() {
    this.removeEventListener('keydown', this.#keyDownHandler);
    this.removeEventListener('keyup', this.#keyUpHandler);
  }

  get hotkeys() {
    return this.#hotKeys;
  }

  keyboardShortcutHandler(e) {
    // TODO: e.target might need to be replaced w/ e.composedPath to account for shadow DOM.
    // if the event's key is already handled by the target, skip keyboard shortcuts
    // keysUsed is either an attribute or a property.
    // The attribute is a DOM array and the property is a JS array
    // In the attribute Space represents the space key and gets convered to ' '
    const keysUsed = (e.target.getAttribute(Attributes.KEYS_USED)?.split(' ') ?? e.target?.keysUsed ?? [])
      .map(key => key === 'Space' ? ' ' : key)
      .filter(Boolean);

    if (keysUsed.includes(e.key)) {
      return;
    }

    let eventName, currentTimeStr, currentTime, detail, evt;
    const seekOffset = DEFAULT_SEEK_OFFSET;

    // if the blocklist contains the key, skip handling it.
    if (this.#hotKeys.contains(`no${e.key.toLowerCase()}`)) return;
    if (e.key === ' ' && this.#hotKeys.contains(`nospace`)) return;

    // These event triggers were copied from the revelant buttons
    switch (e.key) {
      case ' ':
      case 'k':
        eventName =
          this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null
            ? MediaUIEvents.MEDIA_PLAY_REQUEST
            : MediaUIEvents.MEDIA_PAUSE_REQUEST;
        this.dispatchEvent(
          new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
        break;

      case 'm':
        eventName =
          this.getAttribute(MediaUIAttributes.MEDIA_VOLUME_LEVEL) === 'off'
            ? MediaUIEvents.MEDIA_UNMUTE_REQUEST
            : MediaUIEvents.MEDIA_MUTE_REQUEST;
        this.dispatchEvent(
          new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
        );
        break;

      case 'f':
        eventName =
          this.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null
            ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
            : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
        this.dispatchEvent(
          new globalThis.CustomEvent(eventName, { composed: true, bubbles: true })
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
        currentTimeStr = this.getAttribute(
          MediaUIAttributes.MEDIA_CURRENT_TIME
        );
        currentTime =
          currentTimeStr && !Number.isNaN(+currentTimeStr)
            ? +currentTimeStr
            : DEFAULT_TIME;
        detail = Math.max(currentTime - seekOffset, 0);
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;

      case 'ArrowRight':
        currentTimeStr = this.getAttribute(
          MediaUIAttributes.MEDIA_CURRENT_TIME
        );
        currentTime =
          currentTimeStr && !Number.isNaN(+currentTimeStr)
            ? +currentTimeStr
            : DEFAULT_TIME;
        detail = Math.max(currentTime + seekOffset, 0);
        evt = new globalThis.CustomEvent(MediaUIEvents.MEDIA_SEEK_REQUEST, {
          composed: true,
          bubbles: true,
          detail,
        });
        this.dispatchEvent(evt);
        break;

      default:
        break;
    }
  }
}

const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);
const MEDIA_UI_PROP_NAMES = Object.values(MediaUIProps);

const getMediaUIAttributesFrom = (child) => {
  let { observedAttributes } = child.constructor;

  // observedAttributes are only available if the custom element was upgraded.
  // example: media-gesture-receiver in the shadow DOM requires an upgrade.
  if (!observedAttributes && child.nodeName?.includes('-')) {
    globalThis.customElements.upgrade(child);
    ({ observedAttributes } = child.constructor);
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

const hasMediaUIProps = (mediaStateReceiverCandidate) => {
  if (
    mediaStateReceiverCandidate.nodeName?.includes('-')
    && !!globalThis.customElements.get(mediaStateReceiverCandidate.nodeName?.toLowerCase())
    && !(mediaStateReceiverCandidate instanceof globalThis.customElements.get(mediaStateReceiverCandidate.nodeName.toLowerCase()))
  ) {
    globalThis.customElements.upgrade(mediaStateReceiverCandidate);
  }
  return MEDIA_UI_PROP_NAMES.some(propName => propName in mediaStateReceiverCandidate);
};

const isMediaStateReceiver = (child) => {
  return hasMediaUIProps(child) || !!getMediaUIAttributesFrom(child).length;
};

const serializeTuple = (tuple) => tuple?.join?.(':');

const CustomAttrSerializer = {
  [MediaUIAttributes.MEDIA_SUBTITLES_LIST]: stringifyTextTrackList,
  [MediaUIAttributes.MEDIA_SUBTITLES_SHOWING]: stringifyTextTrackList,
  [MediaUIAttributes.MEDIA_SEEKABLE]: serializeTuple,
  [MediaUIAttributes.MEDIA_BUFFERED]: (tuples) => tuples?.map(serializeTuple).join(' '),
  [MediaUIAttributes.MEDIA_PREVIEW_COORDS]: (coords) => coords?.join(' '),
  [MediaUIAttributes.MEDIA_RENDITION_LIST]: stringifyRenditionList,
  [MediaUIAttributes.MEDIA_AUDIO_TRACK_LIST]: stringifyAudioTrackList,
};

const setAttr = async (child, attrName, attrValue) => {
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
    return setNumericAttr(child, attrName, attrValue)
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

const isMediaSlotElementDescendant = (el) => !!el.closest?.('*[slot="media"]');

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
  rootNode,
  mediaStateReceiverCallback
) => {
  // We (currently) don't check if descendants of the `media` (e.g. <video/>) are Media State Receivers
  // See also: `propagateMediaState`
  if (isMediaSlotElementDescendant(rootNode)) {
    return;
  }

  const traverseForMediaStateReceiversSync = (
    rootNode,
    mediaStateReceiverCallback
  ) => {
    // The rootNode is itself a Media State Receiver
    if (isMediaStateReceiver(rootNode)) {
      mediaStateReceiverCallback(rootNode);
    }

    const { children = [] } = rootNode ?? {};
    const shadowChildren = rootNode?.shadowRoot?.children ?? [];
    const allChildren = [...children, ...shadowChildren];

    // Traverse all children (including shadowRoot children) to see if they are/have Media State Receivers
    allChildren.forEach((child) =>
      traverseForMediaStateReceivers(child, mediaStateReceiverCallback)
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

const propagateMediaState = (els, stateName, val) => {
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

const getStateValue = (els, stateName) => {
  for (const el of els) {
    if (stateName in el) {
      return el[stateName];
    }
    const relevantAttrs = getMediaUIAttributesFrom(el);
    const attrName = stateName.toLowerCase();
    if (!relevantAttrs.includes(attrName)) continue;
    return el.getAttribute(attrName);
  }
}

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
  rootNode,
  registerMediaStateReceiver,
  unregisterMediaStateReceiver
) => {
  // First traverse the tree to register any current Media State Receivers
  traverseForMediaStateReceivers(rootNode, registerMediaStateReceiver);

  // Monitor for any event-based requests from descendants to register/unregister as a Media State Receiver
  const registerMediaStateReceiverHandler = (evt) => {
    const el = evt?.composedPath()[0] ?? evt.target;
    registerMediaStateReceiver(el);
  };

  const unregisterMediaStateReceiverHandler = (evt) => {
    const el = evt?.composedPath()[0] ?? evt.target;
    unregisterMediaStateReceiver(el);
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
  const mutationCallback = (mutationsList) => {
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
          traverseForMediaStateReceivers(node, registerMediaStateReceiver)
        );
        // For each removed node, unregister any Media State Receiver descendants (including itself)
        Array.prototype.forEach.call(removedNodes, (node) =>
          traverseForMediaStateReceivers(node, unregisterMediaStateReceiver)
        );
      } else if (
        type === 'attributes' &&
        attributeName === MediaStateReceiverAttributes.MEDIA_CHROME_ATTRIBUTES
      ) {
        if (isMediaStateReceiver(target)) {
          // Changed from a "non-Media State Receiver" to a Media State Receiver: register it.
          registerMediaStateReceiver(target);
        } else {
          // Changed from a Media State Receiver to a "non-Media State Receiver": unregister it.
          unregisterMediaStateReceiver(target);
        }
      }
    });
  };

  // Storing prevSlotted elements so we can cleanup if slotted elements change over time.
  let prevSlotted = [];
  const slotChangeHandler = (event) => {
    const slotEl = /** @type {HTMLSlotElement} */ event.target;
    if (slotEl.name === "media") return;
    prevSlotted.forEach((node) =>
      traverseForMediaStateReceivers(node, unregisterMediaStateReceiver)
    );
    prevSlotted = /** @type {HTMLElement[]} */ ([...slotEl.assignedElements({ flatten: true })]);
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

export default MediaController;
