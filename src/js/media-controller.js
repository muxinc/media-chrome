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
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { fullscreenApi } from './utils/fullscreenApi.js';
import { constToCamel } from './utils/stringUtils.js';

import {
  MediaUIEvents,
  MediaUIAttributes,
  TextTrackKinds,
  TextTrackModes,
} from './constants.js';
import {
  stringifyTextTrackList,
  getTextTracksList,
  updateTracksModeTo,
} from './utils/captions.js';
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
      MEDIA_MUTE_REQUEST: () => (this.media.muted = true),
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
        } catch (err) {}
      },

      // This current assumes that the media controller is the fullscreen element
      // which may be true in most cases but not all.
      // The prior version of media-chrome supported alt fullscreen elements
      // and that's something we can work towards here
      MEDIA_ENTER_FULLSCREEN_REQUEST: () => {
        const docOrRoot = this.getRootNode();
        const media = this.media;

        if (docOrRoot.pictureInPictureElement) {
          // Should be async
          docOrRoot.exitPictureInPicture();
        }

        if (super[fullscreenApi.enter]) {
          // Media chrome container fullscreen
          super[fullscreenApi.enter]();
        } else if (media.webkitEnterFullscreen) {
          // Media element fullscreen using iOS API
          media.webkitEnterFullscreen();
        } else if (media.requestFullscreen) {
          // Media element fullscreen, using correct API
          // So media els don't have to implement multiple APIs.
          media.requestFullscreen();
        } else {
          console.warn('MediaChrome: Fullscreen not supported');
        }
      },
      MEDIA_EXIT_FULLSCREEN_REQUEST: () => {
        document[fullscreenApi.exit]();

        // Shadow root throws an error for this function
        // this.getRootNode()[fullscreenApi.exit]();
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
        // No media (yet), so bail early
        if (!media) return;

        const [track] = getTextTracksList(media, {
          kind: TextTrackKinds.METADATA,
          label: 'thumbnails',
        });
        // No thumbnails track (yet) or no cues available in thumbnails track, so bail early.
        if (!(track && track.cues)) return;

        const time = e.detail;
        const cue = Array.prototype.find.call(
          track.cues,
          (c) => c.startTime >= time
        );

        // No corresponding cue, so bail early
        if (!cue) return;

        // Since this isn't really "global state", we may want to consider moving this "down" to the component level,
        // probably pulled out into its own module/set of functions (CJP)
        const url = new URL(cue.text);
        const previewCoordsStr = new URLSearchParams(url.hash).get('#xywh');
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
          url.href
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_PREVIEW_COORDS,
          previewCoordsStr.split(',').join(' ')
        );
      },
      MEDIA_SHOW_CAPTIONS_REQUEST: (e) => {
        const tracks = this.captionTracks;
        const { detail: tracksToUpdate = [] } = e;
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      },
      // NOTE: We're currently recommending and providing default components that will "disable" tracks when
      // we don't want them shown (rather than "hiding" them).
      // For a discussion why, see: https://github.com/muxinc/media-chrome/issues/60
      MEDIA_DISABLE_CAPTIONS_REQUEST: (e) => {
        const tracks = this.captionTracks;
        const { detail: tracksToUpdate = [] } = e;
        updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
      },
      MEDIA_SHOW_SUBTITLES_REQUEST: (e) => {
        const tracks = this.subtitleTracks;
        const { detail: tracksToUpdate = [] } = e;
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      },
      MEDIA_DISABLE_SUBTITLES_REQUEST: (e) => {
        const tracks = this.subtitleTracks;
        const { detail: tracksToUpdate = [] } = e;
        updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
      },
      MEDIA_AIRPLAY_REQUEST: (_e) => {
        const { media } = this;
        if (!media) return;
        if (
          !(
            media.webkitShowPlaybackTargetPicker &&
            window.WebKitPlaybackTargetAvailabilityEvent
          )
        ) {
          console.warn(
            'received a request to select AirPlay but AirPlay is not supported in this environment'
          );
          return;
        }
        media.webkitShowPlaybackTargetPicker();
      },
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
        this.propagateMediaState(MediaUIAttributes.MEDIA_PAUSED, this.paused);
      },
      volumechange: () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_MUTED, this.muted);
        this.propagateMediaState(MediaUIAttributes.MEDIA_VOLUME, this.volume);
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_VOLUME_LEVEL,
          this.volumeLevel
        );
      },
      [fullscreenApi.event]: () => {
        // Might be in the shadow dom
        const fullscreenEl = this.getRootNode()[fullscreenApi.element];
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_IS_FULLSCREEN,
          fullscreenEl === this
        );
      },
      'enterpictureinpicture,leavepictureinpicture': (e) => {
        let isPip;

        // Rely on event type for state first
        // in case this doesn't work well for custom elements using internal <video>
        if (e) {
          isPip = e.type == 'enterpictureinpicture';
        } else {
          isPip = this.isPip;
        }
        this.propagateMediaState(MediaUIAttributes.MEDIA_IS_PIP, isPip);
      },
      'timeupdate,loadedmetadata': () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CURRENT_TIME,
          this.currentTime
        );
      },
      'durationchange,loadedmetadata': () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_DURATION,
          this.duration
        );
      },
      ratechange: () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_PLAYBACK_RATE,
          this.playbackRate
        );
      },
      'waiting,playing': () => {
        const isLoading = this.media?.readyState < 3;
        this.propagateMediaState(MediaUIAttributes.MEDIA_LOADING, isLoading);
      },
    };

    /**
     * @TODO This and _mediaStatePropagators should be refactored to be less presumptuous about what is being
     * monitored (and also probably how it's being monitored) (CJP)
     */
    this._textTrackMediaStatePropagators = {
      'addtrack,removetrack': () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CAPTIONS_LIST,
          stringifyTextTrackList(this.captionTracks) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_SUBTITLES_LIST,
          stringifyTextTrackList(this.subtitleTracks) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
          stringifyTextTrackList(this.showingCaptionTracks) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
          stringifyTextTrackList(this.showingSubtitleTracks) || undefined
        );
      },
      change: () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
          stringifyTextTrackList(this.showingCaptionTracks) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
          stringifyTextTrackList(this.showingSubtitleTracks) || undefined
        );
      },
    };
  }

  mediaSetCallback(media) {
    super.mediaSetCallback(media);
    // Listen for media state changes and propagate them to children and associated els
    Object.keys(this._mediaStatePropagators).forEach((key) => {
      const events = key.split(',');
      const handler = this._mediaStatePropagators[key];

      events.forEach((event) => {
        // If this is fullscreen apply to the document
        const target =
          event == fullscreenApi.event ? this.getRootNode() : media;

        target.addEventListener(event, handler);
      });
      handler();
    });

    Object.entries(this._textTrackMediaStatePropagators).forEach(
      ([eventsStr, handler]) => {
        const events = eventsStr.split(',');
        events.forEach((event) => {
          if (media.textTracks) {
            media.textTracks.addEventListener(event, handler);
          }
        });
        handler();
      }
    );

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
      const events = key.split(',');
      const handler = this._mediaStatePropagators[key];

      events.forEach((event) => {
        const target =
          event == fullscreenApi.event ? this.getRootNode() : media;
        target.removeEventListener(event, handler);
      });
    });

    Object.entries(this._textTrackMediaStatePropagators).forEach(
      ([eventsStr, handler]) => {
        const events = eventsStr.split(',');
        events.forEach((event) => {
          if (media.textTracks) {
            media.textTracks.removeEventListener(event, handler);
          }
        });
        handler();
      }
    );

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

    // TODO: Update to propagate all states when registered
    if (this.media) {
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_CAPTIONS_LIST,
        stringifyTextTrackList(this.captionTracks) || undefined
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_SUBTITLES_LIST,
        stringifyTextTrackList(this.subtitleTracks) || undefined
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
        stringifyTextTrackList(this.showingCaptionTracks) || undefined
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
        stringifyTextTrackList(this.showingSubtitleTracks) || undefined
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_PAUSED,
        this.paused
      );
      // propagateMediaState([el], MediaUIAttributes.MEDIA_VOLUME_LEVEL, level);
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_MUTED,
        this.muted
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_VOLUME,
        this.volume
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_VOLUME_LEVEL,
        this.volumeLevel
      );
      // const fullscreenEl = this.getRootNode()[fullscreenApi.element];
      // propagateMediaState([el], MediaUIAttributes.MEDIA_IS_FULLSCREEN, fullscreenEl === this);
      // propagateMediaState([el], MediaUIAttributes.MEDIA_IS_PIP, isPip);
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_CURRENT_TIME,
        this.currentTime
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_DURATION,
        this.duration
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_PLAYBACK_RATE,
        this.playbackRate
      );
    }
  }

  unregisterMediaStateReceiver(el) {
    const els = this.mediaStateReceivers;

    const index = els.indexOf(el);
    if (index < 0) return;

    els.splice(index, 1);
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

  get paused() {
    if (!this.media) return true;

    return this.media.paused;
  }

  get muted() {
    return !!(this.media && this.media.muted);
  }

  set muted(mute) {
    const eventName = mute ? MEDIA_MUTE_REQUEST : MEDIA_UNMUTE_REQUEST;
    this.dispatchEvent(new window.CustomEvent(eventName));
  }

  get volume() {
    const media = this.media;

    return media ? media.volume : 1;
  }

  set volume(volume) {
    this.dispatchEvent(
      new window.CustomEvent(MEDIA_VOLUME_REQUEST, { detail: volume })
    );
  }

  get volumeLevel() {
    let level = 'high';

    if (!this.media) return level;

    const { muted, volume } = this.media;

    if (volume === 0 || muted) {
      level = 'off';
    } else if (volume < 0.5) {
      level = 'low';
    } else if (volume < 0.75) {
      level = 'medium';
    }

    return level;
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
    this.dispatchEvent(
      new window.CustomEvent(MEDIA_SEEK_REQUEST, { detail: time })
    );
  }

  get duration() {
    const media = this.media;

    return media ? media.duration : NaN;
  }

  get playbackRate() {
    const media = this.media;

    return media ? media.playbackRate : 1;
  }

  set playbackRate(rate) {
    this.dispatchEvent(
      new window.CustomEvent(MEDIA_PLAYBACK_RATE_REQUEST, { detail: rate })
    );
  }

  get subtitleTracks() {
    return getTextTracksList(this.media, { kind: TextTrackKinds.SUBTITLES });
  }

  get captionTracks() {
    return getTextTracksList(this.media, { kind: TextTrackKinds.CAPTIONS });
  }

  get showingSubtitleTracks() {
    return getTextTracksList(this.media, {
      kind: TextTrackKinds.SUBTITLES,
      mode: TextTrackModes.SHOWING,
    });
  }

  get showingCaptionTracks() {
    return getTextTracksList(this.media, {
      kind: TextTrackKinds.CAPTIONS,
      mode: TextTrackModes.SHOWING,
    });
  }

  get isPip() {
    return (
      this.media && this.media == this.getRootNode().pictureInPictureElement
    );
  }

  requestPictureInPicture() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_ENTER_PIP_REQUEST));
  }

  exitPictureInPicture() {
    this.dispatchEvent(new window.CustomEvent(MEDIA_EXIT_PIP_REQUEST));
  }

  requestPreview(time) {
    this.dispatchEvent(
      new window.CustomEvent(MEDIA_PREVIEW_REQUEST, { detail: time })
    );
  }
}

const MEDIA_UI_ATTRIBUTE_NAMES = Object.values(MediaUIAttributes);

const getMediaUIAttributesFrom = (child) => {
  const {
    constructor: { observedAttributes },
  } = child;
  const mediaChromeAttributesList = child
    ?.getAttribute?.(MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES)
    ?.split?.(/\s+/);
  if (!Array.isArray(observedAttributes || mediaChromeAttributesList))
    return [];
  return (observedAttributes || mediaChromeAttributesList).filter((attrName) =>
    MEDIA_UI_ATTRIBUTE_NAMES.includes(attrName)
  );
};

const isMediaStateReceiver = (child) => {
  return !!getMediaUIAttributesFrom(child).length;
};

const setAttr = (child, attrName, attrValue) => {
  if (attrValue == undefined) {
    return child.removeAttribute(attrName);
  }
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
  // (instead of using `window.customElements.get(name)` to check if a custom element is already defined/registered)
  // because we encountered some reliability issues with the custom element instances not being fully "ready", even if/when
  // they are available in the registry via `window.customElements.get(name)`.
  const name = rootNode?.nodeName.toLowerCase();
  if (name.includes('-') && !isMediaStateReceiver(rootNode)) {
    window.customElements.whenDefined(name).then(() => {
      // Try/traverse again once the custom element is defined
      traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
    });
    return;
  }

  traverseForMediaStateReceiversSync(rootNode, mediaStateReceiverCallback);
};

const propagateMediaState = (els, stateName, val) => {
  els.forEach((el) => {
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
  const mutationCallback = (mutationsList, _observer) => {
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
        attributeName === MediaUIAttributes.MEDIA_CHROME_ATTRIBUTES
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

  const observer = new MutationObserver(mutationCallback);
  observer.observe(rootNode, {
    childList: true,
    attributes: true,
    subtree: true,
  });

  const unsubscribe = () => {
    // Unregister any Media State Receiver descendants (including ourselves)
    traverseForMediaStateReceivers(rootNode, unregisterMediaStateReceiver);
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

defineCustomElement('media-controller', MediaController);

export default MediaController;
