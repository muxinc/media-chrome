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
import { containsComposedNode } from './utils/element-utils.js';

import {
  MediaUIEvents,
  MediaUIAttributes,
  TextTrackKinds,
  TextTrackModes,
  AvailabilityStates,
  AttributeToStateChangeEventMap,
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

    if (!airplaySupported) {
      this._airplayUnavailable = AvailabilityStates.UNSUPPORTED;
    }
    if (!castSupported) {
      this._castUnavailable = AvailabilityStates.UNSUPPORTED;
    }
    if (!pipSupported) {
      this._pipUnavailable = AvailabilityStates.UNSUPPORTED;
    }
    if (volumeSupported !== undefined) {
      if (!volumeSupported) {
        this._volumeUnavailable = AvailabilityStates.UNSUPPORTED;
      }
    } else {
      volumeSupportPromise.then(() => {
        if (!volumeSupported) {
          this._volumeUnavailable = AvailabilityStates.UNSUPPORTED;
          this.propagateMediaState(MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE, this._volumeUnavailable);
        }
      });
    }

    // Include this for styling convenience or exclude since it
    // can be derived from MEDIA_CAPTIONS_LIST && MEDIA_SUBTITLES_LIST? (CJP)
    // this._captionsUnavailable;

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
      // and that's something we can work towards here.
      //
      // Generally the fullscreen and PiP API's have the exit methods and enabled
      // flags on the `document`. The active element is accessed on the document
      // or shadow root but Safari doesn't support this.
      // Entering fullscreen or PiP is called on the element. i.e.
      //
      //   - Document.exitFullscreen()
      //   - Document.fullscreenEnabled
      //   - Document.fullscreenElement / (ShadowRoot.fullscreenElement)
      //   - Element.requestFullscreen()
      //
      MEDIA_ENTER_FULLSCREEN_REQUEST: () => {
        const media = this.media;

        if (document.pictureInPictureElement) {
          // Should be async
          document.exitPictureInPicture();
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
      },
      MEDIA_ENTER_PIP_REQUEST: () => {
        const media = this.media;

        if (!document.pictureInPictureEnabled) return;

        // Exit fullscreen if needed
        if (document[fullscreenApi.element]) {
          document[fullscreenApi.exit]();
        }

        media.requestPictureInPicture();
      },
      MEDIA_EXIT_PIP_REQUEST: () => {
        if (document.pictureInPictureElement) {
          // Should be async
          document.exitPictureInPicture();
        }
      },
      MEDIA_ENTER_CAST_REQUEST: () => {
        const media = this.media;

        if (!CastableVideo?.castEnabled) return;

        // Exit fullscreen if needed
        if (document[fullscreenApi.element]) {
          document[fullscreenApi.exit]();
        }

        // Open the browser cast menu.
        // Note this relies on a customized video[is=castable-video] element.
        media.requestCast();
      },
      MEDIA_EXIT_CAST_REQUEST: async () => {
        if (CastableVideo.castElement) {
          CastableVideo.exitCast();
        }
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
        const base = !/'^(?:[a-z]+:)?\/\//i.test(cue.text)
          ? media.querySelector('track[label="thumbnails"]')?.src
          : undefined;
        const url = new URL(cue.text, base);
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
        const tracks = getCaptionTracks(this);
        const { detail: tracksToUpdate = [] } = e;
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      },
      // NOTE: We're currently recommending and providing default components that will "disable" tracks when
      // we don't want them shown (rather than "hiding" them).
      // For a discussion why, see: https://github.com/muxinc/media-chrome/issues/60
      MEDIA_DISABLE_CAPTIONS_REQUEST: (e) => {
        const tracks = getCaptionTracks(this);
        const { detail: tracksToUpdate = [] } = e;
        updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
      },
      MEDIA_SHOW_SUBTITLES_REQUEST: (e) => {
        const tracks = getSubtitleTracks(this);
        const { detail: tracksToUpdate = [] } = e;
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      },
      MEDIA_DISABLE_SUBTITLES_REQUEST: (e) => {
        const tracks = getSubtitleTracks(this);
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
      'play,pause,emptied': () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_PAUSED, getPaused(this));
      },
      'playing,emptied': () => {
        // We want to let the user know that the media started playing at any point (`media-has-played`).
        // Since these propagators are all called when boostrapping state, let's verify this is
        // a real playing event by checking that 1) there's media and 2) it isn't currently paused.
        this.propagateMediaState(MediaUIAttributes.MEDIA_HAS_PLAYED, !this.media?.paused);
      }, 
      volumechange: () => {
        this.propagateMediaState(MediaUIAttributes.MEDIA_MUTED, getMuted(this));
        this.propagateMediaState(MediaUIAttributes.MEDIA_VOLUME, getVolume(this));
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_VOLUME_LEVEL,
          getVolumeLevel(this)
        );
      },
      [fullscreenApi.event]: (e) => {
        // Safari doesn't support ShadowRoot.fullscreenElement and document.fullscreenElement
        // could be several ancestors up the tree. Use event.target instead.
        const isSomeElementFullscreen = !!document[fullscreenApi.element];
        const fullscreenEl = isSomeElementFullscreen && e?.target;
        const isFullScreen = containsComposedNode(this, fullscreenEl);
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_IS_FULLSCREEN,
          isFullScreen
        );
      },
      'enterpictureinpicture,leavepictureinpicture': (e) => {
        let isPip;

        // Rely on event type for state first
        // in case this doesn't work well for custom elements using internal <video>
        if (e) {
          isPip = e.type == 'enterpictureinpicture';
        } else {
          const pipElement =
            this.getRootNode().pictureInPictureElement ??
            document.pictureInPictureElement;
          isPip = this.media && containsComposedNode(this.media, pipElement);
        }
        this.propagateMediaState(MediaUIAttributes.MEDIA_IS_PIP, isPip);
      },
      // Note this relies on a customized video[is=castable-video] element.
      'entercast,leavecast,castchange': (e) => {
        let castState = this.media && globalThis.CastableVideo?.castElement === this.media;

        // While the cast is connecting set media-is-cast="connecting"
        if (e?.type === 'castchange' && e?.detail === 'CONNECTING') {
          castState = 'connecting';
        }

        this.propagateMediaState(MediaUIAttributes.MEDIA_IS_CAST, castState);
      },
      'timeupdate,loadedmetadata': () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CURRENT_TIME,
          getCurrentTime(this)
        );
      },
      'durationchange,loadedmetadata,emptied': () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_DURATION,
          getDuration(this)
        );
      },
      'progress,emptied': () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_BUFFERED,
          serializeTimeRanges(this.media?.buffered)
        );
      },
      ratechange: () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_PLAYBACK_RATE,
          getPlaybackRate(this)
        );
      },
      'waiting,playing,emptied': () => {
        const isLoading = this.media?.readyState < 3;
        this.propagateMediaState(MediaUIAttributes.MEDIA_LOADING, isLoading);
      },
    };

    if (this._airplayUnavailable !== AvailabilityStates.UNSUPPORTED) {
      const airplaySupporHandler = (event) => {
        // NOTE: since we invoke all these event handlers without arguments whenever a media is attached,
        // need to account for the possibility that event is undefined (CJP).
        if (event?.availability === 'available') {
          this._airplayUnavailable = undefined;
        } else if (event?.availability === 'not-available') {
          this._airplayUnavailable = AvailabilityStates.UNAVAILABLE;
        }
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE,
          this._airplayUnavailable
        );
      };
      // NOTE: only adding this if airplay is supported, in part to avoid unnecessary battery consumption per
      // Apple docs recommendations (See: https://developer.apple.com/documentation/webkitjs/adding_an_airplay_button_to_your_safari_media_controls)
      // For a more advanced solution, we could monitor for media state receivers that "care" about airplay support and add/remove
      // whenever these are added/removed. (CJP)
      this._mediaStatePropagators['webkitplaybacktargetavailabilitychanged'] =
        airplaySupporHandler;
    }

    if (this._castUnavailable !== AvailabilityStates.UNSUPPORTED) {
      const castSupportHandler = (event) => {
        if (event?.detail === 'NO_DEVICES_AVAILABLE') {
          this._castUnavailable = AvailabilityStates.UNAVAILABLE;
        } else {
          this._castUnavailable = undefined;
        }
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CAST_UNAVAILABLE,
          this._castUnavailable
        );
      };
      // Note this relies on a customized video[is=castable-video] element.
      this._mediaStatePropagators['castchange'] = castSupportHandler;
    }

    /**
     * @TODO This and _mediaStatePropagators should be refactored to be less presumptuous about what is being
     * monitored (and also probably how it's being monitored) (CJP)
     */
    this._textTrackMediaStatePropagators = {
      'addtrack,removetrack,loadstart': () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CAPTIONS_LIST,
          stringifyTextTrackList(getCaptionTracks(this)) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_SUBTITLES_LIST,
          stringifyTextTrackList(getSubtitleTracks(this)) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
          stringifyTextTrackList(getShowingCaptionTracks(this)) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
          stringifyTextTrackList(getShowingSubtitleTracks(this)) || undefined
        );
      },
      change: () => {
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
          stringifyTextTrackList(getShowingCaptionTracks(this)) || undefined
        );
        this.propagateMediaState(
          MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
          stringifyTextTrackList(getShowingSubtitleTracks(this)) || undefined
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
    const evt = new window.CustomEvent(
      AttributeToStateChangeEventMap[stateName],
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

    // No media depedencies, so push regardless of media availability.
    propagateMediaState(
      [el],
      MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE,
      this._volumeUnavailable
    );
    propagateMediaState(
      [el],
      MediaUIAttributes.MEDIA_AIRPLAY_UNAVAILABLE,
      this._airplayUnavailable
    );
    propagateMediaState(
      [el],
      MediaUIAttributes.MEDIA_CAST_UNAVAILABLE,
      this._castUnavailable
    );
    propagateMediaState(
      [el],
      MediaUIAttributes.MEDIA_PIP_UNAVAILABLE,
      this._pipUnavailable,
    );

    // TODO: Update to propagate all states when registered
    if (this.media) {
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_CAPTIONS_LIST,
        stringifyTextTrackList(getCaptionTracks(this)) || undefined
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_SUBTITLES_LIST,
        stringifyTextTrackList(getSubtitleTracks(this)) || undefined
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
        stringifyTextTrackList(getShowingCaptionTracks(this)) || undefined
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
        stringifyTextTrackList(getShowingSubtitleTracks(this)) || undefined
      );
      propagateMediaState([el], MediaUIAttributes.MEDIA_PAUSED, getPaused(this));
      // propagateMediaState([el], MediaUIAttributes.MEDIA_VOLUME_LEVEL, level);
      propagateMediaState([el], MediaUIAttributes.MEDIA_MUTED, getMuted(this));
      propagateMediaState([el], MediaUIAttributes.MEDIA_VOLUME, getVolume(this));
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_VOLUME_LEVEL,
        getVolumeLevel(this)
      );
      // const fullscreenEl = this.getRootNode()[fullscreenApi.element];
      // propagateMediaState([el], MediaUIAttributes.MEDIA_IS_FULLSCREEN, fullscreenEl === this);
      // propagateMediaState([el], MediaUIAttributes.MEDIA_IS_PIP, isPip);
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_CURRENT_TIME,
        getCurrentTime(this)
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_DURATION,
        getDuration(this)
      );
      propagateMediaState(
        [el],
        MediaUIAttributes.MEDIA_PLAYBACK_RATE,
        getPlaybackRate(this)
      );
    }
  }

  unregisterMediaStateReceiver(el) {
    const els = this.mediaStateReceivers;

    const index = els.indexOf(el);
    if (index < 0) return;

    els.splice(index, 1);
  }

  /**
   * Media Controller should not mimic the HTMLMediaElement API.
   * @see https://github.com/muxinc/media-chrome/pull/182#issuecomment-1067370339
   */
}

const getPaused = (controller) => {
  if (!controller.media) return true;

  return controller.media.paused;
};

const getMuted = (controller) => {
  return !!(controller.media && controller.media.muted);
};

const getVolume = (controller) => {
  const media = controller.media;

  return media ? media.volume : 1;
};

const getVolumeLevel = (controller) => {
  let level = 'high';

  if (!controller.media) return level;

  const { muted, volume } = controller.media;

  if (volume === 0 || muted) {
    level = 'off';
  } else if (volume < 0.5) {
    level = 'low';
  } else if (volume < 0.75) {
    level = 'medium';
  }

  return level;
};

const getCurrentTime = (controller) => {
  const media = controller.media;

  return media ? media.currentTime : 0;
};

const getDuration = (controller) => {
  const media = controller.media;

  return media ? media.duration : NaN;
};

const getPlaybackRate = (controller) => {
  const media = controller.media;

  return media ? media.playbackRate : 1;
};

const getSubtitleTracks = (controller) => {
  return getTextTracksList(controller.media, { kind: TextTrackKinds.SUBTITLES });
};

const getCaptionTracks = (controller) => {
  return getTextTracksList(controller.media, { kind: TextTrackKinds.CAPTIONS });
};

const getShowingSubtitleTracks = (controller) => {
  return getTextTracksList(controller.media, {
    kind: TextTrackKinds.SUBTITLES,
    mode: TextTrackModes.SHOWING,
  });
};

const getShowingCaptionTracks = (controller) => {
  return getTextTracksList(controller.media, {
    kind: TextTrackKinds.CAPTIONS,
    mode: TextTrackModes.SHOWING,
  });
};

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

const setAttr = async (child, attrName, attrValue) => {
  // If the node is not connected to the DOM yet wait on macrotask. Fix for:
  //   Uncaught DOMException: Failed to construct 'CustomElement':
  //   The result must not have attributes
  if (!child.isConnected) {
    await delay(0);
  }

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

let testMediaEl;
export const getTestMediaEl = () => {
  if (testMediaEl) return testMediaEl;
  testMediaEl = document?.createElement?.('video');
  return testMediaEl;
};

export const hasVolumeSupportAsync = async (mediaEl = getTestMediaEl()) => {
  if (!mediaEl) return false;
  const prevVolume = mediaEl.volume;
  mediaEl.volume = prevVolume / 2 + 0.1;
  await delay(0);
  return mediaEl.volume !== prevVolume;
};

/**
 * Returns a promise that will resolve after passed ms.
 * @param  {number} ms
 * @return {Promise}
 */
export const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

export const hasPipSupport = (mediaEl = getTestMediaEl()) =>
  typeof mediaEl?.requestPictureInPicture === 'function';

const pipSupported = hasPipSupport();

let volumeSupported;
const volumeSupportPromise = hasVolumeSupportAsync().then((supported) => {
  volumeSupported = supported;
  return volumeSupported;
});

const airplaySupported = !!window.WebKitPlaybackTargetAvailabilityEvent;
const castSupported = !!window.chrome;

function serializeTimeRanges(timeRanges = []) {
  return Array.from(timeRanges)
    .map((_, i) => [
      Number(timeRanges.start(i).toFixed(2)),
      Number(timeRanges.end(i).toFixed(2)),
    ].join(':'))
    .join(' ');
}

defineCustomElement('media-controller', MediaController);

export default MediaController;
