/*
  The <media-chrome> can contain the control elements
  and the media element. Features:
  * Auto-set the `media` attribute on child media chrome elements
    * Uses the element with slot="media"
  * Take custom controls to fullscreen
  * Position controls at the bottom
  * Auto-hide controls on inactivity while playing
*/
import MediaContainer from './media-container.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import { Window as window } from './utils/server-safe-globals.js';
import { fullscreenApi } from './utils/fullscreenApi.js';
import { constToCamel } from './utils/stringUtils.js';

import { MediaUIEvents, MediaUIAttributes } from './constants.js';
const {
  MEDIA_PLAY_REQUEST,
  MEDIA_PAUSE_REQUEST,
  MEDIA_MUTE_REQUEST,
  MEDIA_UNMUTE_REQUEST,
  MEDIA_VOLUME_REQUEST,
  MEDIA_ENTER_FULLSCREEN_REQUEST,
  MEDIA_EXIT_FULLSCREEN_REQUEST,
  MEDIA_SEEK_REQUEST,
  MEDIA_PREVIEW_REQUEST,
  MEDIA_ENTER_PIP_REQUEST,
  MEDIA_EXIT_PIP_REQUEST,
  MEDIA_PLAYBACK_RATE_REQUEST,
} = MediaUIEvents;

class MediaController extends MediaContainer {
  constructor() {
    super();

    // Track externally associated control elements
    this.mediaStateReceivers = [];
    this.associatedElementSubscriptions = new Map();
    this.associatedElements = [];
    this.associateElement(this);

    // Capture request events from internal controls
    const mediaUIEventHandlers = {
      MEDIA_PLAY_REQUEST: () => this.media.play(),
      MEDIA_PAUSE_REQUEST: () => this.media.pause(),
      MEDIA_MUTE_REQUEST: () => this.media.muted = true,
      MEDIA_UNMUTE_REQUEST: () => {
        const media = this.media;

        media.muted = false;

        // Avoid confusion by bumping the volume on unmute
        if (media.volume === 0) {
          media.volume = 0.25;
        }
      },
      MEDIA_VOLUME_REQUEST: (e) => {
        const media = this.media;
        const volume = e.detail;

        media.volume = volume;

        // If the viewer moves the volume we should unmute for them.
        if (volume > 0 && media.muted) {
          media.muted = false;
        }

        // Store the last set volume as a local preference, if ls is supported
        try {
          window.localStorage.setItem(
            'media-chrome-pref-volume',
            volume.toString()
          );
        } catch (err) { }
      },

      // This current assumes that the media controller is the fullscreen element
      // which may be true in most cases but not all.
      // The prior version of media-chrome support alt fullscreen elements
      // and that's something we can work towards here
      MEDIA_ENTER_FULLSCREEN_REQUEST: () => {
        const docOrRoot = this.getRootNode();

        if (docOrRoot.pictureInPictureElement) {
          // Should be async
          docOrRoot.exitPictureInPicture();
        }

        super[fullscreenApi.enter]();
      },
      MEDIA_EXIT_FULLSCREEN_REQUEST: () => {
        this.getRootNode()[fullscreenApi.exit]();
      },
      MEDIA_ENTER_PIP_REQUEST: () => {
        const docOrRoot = this.getRootNode();
        const media = this.media;

        if (!docOrRoot.pictureInPictureEnabled) return;

        // Exit fullscreen if needed
        if (docOrRoot[fullscreenApi.element]) {
          docOrRoot[fullscreenApi.exit]();
        }

        media.requestPictureInPicture();
      },
      MEDIA_EXIT_PIP_REQUEST: () => {
        const docOrRoot = this.getRootNode();

        if (docOrRoot.exitPictureInPicture) docOrRoot.exitPictureInPicture();
      },
      MEDIA_SEEK_REQUEST: (e) => {
        const media = this.media;
        const time = e.detail;

        // Can't set the time before the media is ready
        // Ignore if readyState isn't supported
        if (media.readyState > 0 || media.readyState === undefined) {
          media.currentTime = time;
        }
      },
      MEDIA_PLAYBACK_RATE_REQUEST: (e) => {
        this.media.playbackRate = e.detail;
      },
      MEDIA_PREVIEW_REQUEST: (e) => {
        const media = this.media;
        const time = e.detail;

        if (media && media.textTracks && media.textTracks.length) {
          let track = Array.prototype.find.call(media.textTracks, (t) => {
            return t.label == 'thumbnails';
          });

          if (!track) return;
          if (!track.cues) return;

          let cue = Array.prototype.find.call(track.cues, c => c.startTime >= time);

          if (cue) {
            const url = new URL(cue.text);
            const previewCoordsStr = new URLSearchParams(url.hash).get('#xywh');
            this.propagateMediaState(MediaUIAttributes.MEDIA_PREVIEW_IMAGE, url.href);
            this.propagateMediaState(MediaUIAttributes.MEDIA_PREVIEW_COORDS, previewCoordsStr.split(',').join(' '));
          }
        }
      }
    };

    // Apply ui event listeners
    Object.keys(mediaUIEventHandlers).forEach((key) => {
      const handlerName = `_handle${constToCamel(key, true)}`;

      this[handlerName] = (e) => {
        // Stop media UI events from continuing to bubble
        e.stopPropagation();

        if (!this.media) {
          console.warn('MediaController: No media available.');
          return;
        }

        mediaUIEventHandlers[key](e, this.media);
      };
      this.addEventListener(MediaUIEvents[key], this[handlerName]);
    });

    // Pass media state to child and associated control elements
    this._mediaStatePropagators = {
      'play,pause': () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_PAUSED, this.media.paused);
      },
      'volumechange': () => {
        const { muted, volume } = this.media;

        let level = 'high';
        if (volume == 0 || muted) {
          level = 'off';
        } else if (volume < 0.5) {
          level = 'low';
        } else if (volume < 0.75) {
          level = 'medium';
        }

        this.propagateMediaState(MediaUIAttributes.MEDIA_MUTED, muted);
        this.propagateMediaState(MediaUIAttributes.MEDIA_VOLUME, volume);
        this.propagateMediaState(MediaUIAttributes.MEDIA_VOLUME_LEVEL, level);
      },
      [fullscreenApi.event]: () => {
        // Might be in the shadow dom
        const fullscreenEl = this.getRootNode()[fullscreenApi.element];
        this.propagateMediaState(MediaUIAttributes.MEDIA_IS_FULLSCREEN, fullscreenEl === this);
      },
      'enterpictureinpicture,leavepictureinpicture': (e) => {
        let isPip;

        // Rely on event type for state first
        // in case this doesn't work well for custom elements using internal <video>
        if (e) {
          isPip = e.type == 'enterpictureinpicture';
        } else {
          isPip = this.media == this.getRootNode().pictureInPictureElement
        }
        this.propagateMediaState(MediaUIAttributes.MEDIA_IS_PIP, isPip);
      },
      'timeupdate,loadedmetadata': () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_CURRENT_TIME, this.media.currentTime);
      },
      'durationchange,loadedmetadata': () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_DURATION, this.media.duration);
      },
      'ratechange': () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_PLAYBACK_RATE, this.media.playbackRate);
      }
    }
  }

  mediaSetCallback(media) {
    // Might wait for custom media el to be ready
    if (!super.mediaSetCallback(media)) return;

    // Listen for media state changes and propagate them to children and associated els
    Object.keys(this._mediaStatePropagators).forEach((key) => {
      const events = key.split(',');
      const handler = this._mediaStatePropagators[key];

      events.forEach((event) => {
        // If this is fullscreen apply to the document
        const target = (event == fullscreenApi.event) ? this.getRootNode() : media;

        target.addEventListener(event, handler);
      });
      handler();
    });

    // Update the media with the last set volume preference
    // This would preferably live with the media element,
    // not a control.
    try {
      const volPref = window.localStorage.getItem('media-chrome-pref-volume');
      if (volPref !== null) media.volume = volPref;
    } catch (e) {
      console.debug('Error getting volume pref', e);
    }
  }

  mediaUnsetCallback(media) {
    super.mediaUnsetCallback(media);

    // Remove all state change propagators
    Object.keys(this._mediaStatePropagators).forEach((key) => {
      const { events, handler } = this.mediaStatePropagators[key];

      events.forEach((event) => {
        const target = (event == fullscreenApi.event) ? this.getRootNode() : media;
        target.removeEventListener(event, handler);
      });
    });

    // Reset to paused state
    this.propagateMediaState(MediaUIAttributes.MEDIA_PAUSED, true);
  }

  propagateMediaState(stateName, state) {
    propagateMediaState(this.mediaStateReceivers, stateName, state);
  }

  associateElement(element) {
    if (!element) return;
    const { associatedElementSubscriptions } = this;
    if (associatedElementSubscriptions.has(element)) return;

    const registerMediaStateReceiver = this.registerMediaStateReceiver.bind(this);
    const unregisterMediaStateReceiver = this.unregisterMediaStateReceiver.bind(this);

    /** @TODO Should we support "removing association" */
    const unsubscribe = monitorForMediaStateReceivers(
      element, 
      registerMediaStateReceiver, 
      unregisterMediaStateReceiver,
    );

    associatedElementSubscriptions.set(element, unsubscribe);
  }

  unassociateElement(element) {
    if (!element) return;
    const { associatedElementSubscriptions } = this;
    if (!associatedElementSubscriptions.has(element)) return;
    const unsubscribe = associatedElementSubscriptions.get(element);
    unsubscribe();
    associatedElementSubscriptions.delete(element);
  }

  registerMediaStateReceiver(el) {
    if (!el) return;
    const els = this.mediaStateReceivers;
    const index = els.indexOf(el);
    if (index > -1) return;

    els.push(el);

    // TODO: Update to handle all request events
    // Could just attach all releveant listeners to every associated el
    // or could use the `on${eventName}` prop detection method to know
    // which events the el intends to dispatch
    // The latter requires authors to actually follow that paradigm
    // which is probably a stretch
    Object.keys(MediaUIEvents).forEach((key) => {
      el.addEventListener(MediaUIEvents[key], this[`_handle${constToCamel(key, true)}`]);
    });

    // TODO: Update to propagate all states when registered
    if (this.media) {
      propagateMediaState([el], MediaUIAttributes.MEDIA_PAUSED, this.media.paused);
      // propagateMediaState([el], MediaUIAttributes.MEDIA_VOLUME_LEVEL, level);
      propagateMediaState([el], MediaUIAttributes.MEDIA_MUTED, this.media.muted);
      propagateMediaState([el], MediaUIAttributes.MEDIA_VOLUME, this.media.volume);
      // const fullscreenEl = this.getRootNode()[fullscreenApi.element];
      // propagateMediaState([el], MediaUIAttributes.MEDIA_IS_FULLSCREEN, fullscreenEl === this);
      // propagateMediaState([el], MediaUIAttributes.MEDIA_IS_PIP, isPip);
      propagateMediaState([el], MediaUIAttributes.MEDIA_CURRENT_TIME, this.media.currentTime);
      propagateMediaState([el], MediaUIAttributes.MEDIA_DURATION, this.media.duration);
      propagateMediaState([el], MediaUIAttributes.MEDIA_PLAYBACK_RATE, this.media.playbackRate);
    }
  }

  unregisterMediaStateReceiver(el) {
    const els = this.mediaStateReceivers;

    const index = els.indexOf(el);
    if (index < 0) return;
    
    els.splice(index, 1);
    // Remove all media UI event listeners
    Object.keys(MediaUIEvents).forEach((key) => {
      el.removeEventListener(MediaUIEvents[key], this[`_handle${constToCamel(key, true)}`]);
    });
  }

  // Mimick the media element API, but use it to dispatch media UI events
  // so that everything happens through the events.
  // Not sure how far we should take this API
  play() {
  this.dispatchEvent(new window.CustomEvent(MEDIA_PLAY_REQUEST));
  }

  pause() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_PAUSE_REQUEST));
  }

  get muted() {
    return !!(this.media && this.media.muted);
  }

  set muted(mute) {
    const eventName = (mute) ? MEDIA_MUTE_REQUEST : MEDIA_UNMUTE_REQUEST;
    this.dispatchEvent(new window.CustomEvent(eventName));
  }

  get volume() {
    const media = this.media;

    return media ? media.volume : 1;
  }

  set volume(volume) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_VOLUME_REQUEST, { detail: volume }));
  }

  requestFullscreen() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_ENTER_FULLSCREEN_REQUEST));
  }

  exitFullscreen() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_EXIT_FULLSCREEN_REQUEST));
  }

  get currentTime() {
    const media = this.media;

    return media ? media.currentTime : 0;
  }

  set currentTime(time) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_SEEK_REQUEST, { detail: time }));
  }

  get playbackRate() {
    const media = this.media;

    return media ? media.playbackRate : 1;
  }

  set playbackRate(rate) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_PLAYBACK_RATE_REQUEST, { detail: rate }));
  }

  requestPictureInPicture() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_ENTER_PIP_REQUEST));
  }

  exitPictureInPicture() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_EXIT_PIP_REQUEST));
  }

  requestPreview(time) {
    this.dispatchEvent(new window.CustomEvent(MEDIA_PREVIEW_REQUEST, { detail: time }));
  }
}

const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);

const getMediaUIAttributesFrom = (child) => {
  const { constructor: { observedAttributes } } = child;
  const mediaChromeAttributesList = child?.getAttribute?.(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES)?.split?.(/\s+/);
  if (!Array.isArray(observedAttributes || mediaChromeAttributesList)) return [];
  return (observedAttributes || mediaChromeAttributesList).filter(attrName => MEDIA_UI_ATTRIBUTE_NAMES.includes(attrName));
};

const isMediaStateReceiver = (child) => !!getMediaUIAttributesFrom(child).length;

const setAttr = (child, attrName, attrValue) => {
  if (typeof attrValue === 'boolean') {
    if (attrValue) return child.setAttribute(attrName, '');
    return child.removeAttribute(attrName);
  }
  if (Number.isNaN(attrValue)) {
    return child.removeAttribute(attrName);
  }
  return child.setAttribute(attrName, attrValue);
};

const isMediaSlotElementDescendant = (el) => !!el.closest?.('*[slot="media"]');

const isUndefinedCustomElement = (el) => {
  const name = el?.nodeName.toLowerCase();
  return name.includes('-') && !window.customElements.get(name);
};

/**
 * 
 * @description This function will recursively check for any descendants (including the rootNode) 
 * that are Media State Receivers and invoke `mediaStateReceiverCallback` with any Media State Receiver
 * found
 * 
 * @param {HTMLElement} rootNode 
 * @param {function} mediaStateReceiverCallback 
 */
const traverseForMediaStateReceivers = (rootNode, mediaStateReceiverCallback) => {
  // We (currently) don't check if descendants of the `media` (e.g. <video/>) are Media State Receivers
  // See also: `propagateMediaState`
  if (isMediaSlotElementDescendant(rootNode)) {
    return;
  }
  // If the rootNode is a custom element that's not yet defined/ready, we don't yet know for sure
  // whether or not it or its descendants are Media State Receivers, so wait until it's
  // defined before attempting traversal.
  if (isUndefinedCustomElement(rootNode)) {
    const name = rootNode?.nodeName.toLowerCase();
    window.customElements.whenDefined(name).then(() => {
      // Try/traverse again once the custom element is defined
      traverseForMediaStateReceivers(rootNode, mediaStateReceiverCallback);
    });
    return;
  };

  // The rootNode is itself a Media State Receiver
  if (isMediaStateReceiver(rootNode)) {
    mediaStateReceiverCallback(rootNode);
  }

  const { children = [] } = rootNode ?? {};
  const shadowChildren = rootNode?.shadowRoot?.children ?? [];
  const allChildren = [...children, ...shadowChildren];

  // Traverse all children (including shadowRoot children) to see if they are/have Media State Receivers
  allChildren.forEach(child => traverseForMediaStateReceivers(child, mediaStateReceiverCallback));
};

const propagateMediaState = (els, stateName, val) => {
  els.forEach(el => {
    /** @TODO confirm this is still needed; otherwise, remove (CJP) */
    // Don't propagate into media elements, UI can't live in <video>
    // so just avoid potential conflicts
    if (el.slot === 'media') return;
    
    const relevantAttrs = getMediaUIAttributesFrom(el);
    if (!relevantAttrs.includes(stateName)) return;

    setAttr(el, stateName, val);
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
const monitorForMediaStateReceivers = (rootNode, registerMediaStateReceiver, unregisterMediaStateReceiver) => {

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

  rootNode.addEventListener(MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER, registerMediaStateReceiverHandler);
  rootNode.addEventListener(MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER, unregisterMediaStateReceiverHandler);

  // Observe any changes to the DOM for any descendants that are identifiable as Media State Receivers
  // and register or unregister them, depending on the change that occurred.
  const mutationCallback = (mutationsList, _observer) => {
    mutationsList.forEach(mutationRecord => {
      const { addedNodes = [], removedNodes = [], type, target, attributeName } = mutationRecord;
      if (type === 'childList') {
        // For each added node, register any Media State Receiver descendants (including itself)
        Array.prototype.forEach.call(addedNodes, node => traverseForMediaStateReceivers(node, registerMediaStateReceiver));
        // For each removed node, unregister any Media State Receiver descendants (including itself)
        Array.prototype.forEach.call(removedNodes, node => traverseForMediaStateReceivers(node, unregisterMediaStateReceiver));
      } else if (type === 'attributes' && attributeName === MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES) {
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

  const observer = new MutationObserver(mutationCallback);
  observer.observe(rootNode, { childList: true, attributes: true, subtree: true });

  const unsubscribe = () => {
    // Unregister any Media State Receiver descendants (including ourselves)
    traverseForMediaStateReceivers(rootNode, unregisterMediaStateReceiver);
    // Stop observing for Media State Receivers
    observer.disconnect();
    // Stop listening for Media State Receiver events.
    rootNode.removeEventListener(MediaUIEvents.REGISTER_MEDIA_STATE_RECEIVER, registerMediaStateReceiverHandler);
    rootNode.removeEventListener(MediaUIEvents.UNREGISTER_MEDIA_STATE_RECEIVER, unregisterMediaStateReceiverHandler);
  };

  return unsubscribe;
};

defineCustomElement('media-controller', MediaController);

export default MediaController;
