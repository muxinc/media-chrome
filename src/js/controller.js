import { window, document } from './utils/server-safe-globals.js';
import { fullscreenApi } from './utils/fullscreenApi.js';
import { containsComposedNode } from './utils/element-utils.js';
import { serializeTimeRanges } from './utils/time.js';
import { constToCamel } from './utils/utils.js';
import {
  hasVolumeSupportAsync,
  fullscreenSupported,
  pipSupported,
  airplaySupported,
  castSupported
} from './utils/platform-tests.js';
import {
  MediaUIEvents,
  MediaUIAttributes,
  TextTrackKinds,
  TextTrackModes,
  AvailabilityStates,
  StreamTypes,
} from './constants.js';

import {
  stringifyTextTrackList,
  getTextTracksList,
  updateTracksModeTo,
} from './utils/captions.js';

let volumeSupported;
const volumeSupportPromise = hasVolumeSupportAsync().then((supported) => {
  volumeSupported = supported;
  return volumeSupported;
});

const StreamTypeValues = Object.values(StreamTypes);

const getSubtitleTracks = (controller) => {
  return getTextTracksList(controller.media, (textTrack) => {
    return [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(textTrack.kind);
  }).sort((a, b) => a.kind >= b.kind ? 1 : -1);
};

const getShowingSubtitleTracks = (controller) => {
  return getTextTracksList(controller.media, (textTrack) => {
    return textTrack.mode === TextTrackModes.SHOWING &&
      [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(textTrack.kind);
  });
};

const MediaUIStates = {
  MEDIA_PAUSED: {
    get: function (controller) {
      const { media } = controller;

      return media ? media.paused : true;
    },
    mediaEvents: ['play', 'pause', 'emptied'],
  },
  MEDIA_HAS_PLAYED: {
    // We want to let the user know that the media started playing at any point (`media-has-played`).
    // Since these propagators are all called when boostrapping state, let's verify this is
    // a real playing event by checking that 1) there's media and 2) it isn't currently paused.
    get: function (controller) {
      const { media } = controller;

      if (!media) return false;

      // TODO: Would seem to leave room for issue if this is called
      // after a video has played but is currently paused.
      // Could possibly check for a duration and a positive current time.
      return !media.paused;
    },
    mediaEvents: ['playing', 'emptied'],
  },
  MEDIA_PLAYBACK_RATE: {
    get: function (controller) {
      const { media } = controller;

      if (!media || typeof media.playbackRate == 'undefined') {
        return 1;
      }

      return media.playbackRate;
    },
    mediaEvents: ['ratechange', 'loadstart'],
  },
  MEDIA_MUTED: {
    get: function (controller) {
      const { media } = controller;

      if (!media || typeof media.muted == 'undefined') {
        return false;
      }

      return media.muted;
    },
    mediaEvents: ['volumechange'],
  },
  MEDIA_VOLUME: {
    get: function (controller) {
      const { media } = controller;

      if (!media || typeof media.volume == 'undefined') {
        return 1;
      }

      return Number(media.volume);
    },
    mediaEvents: ['volumechange'],
  },
  MEDIA_VOLUME_LEVEL: {
    get: function (controller) {
      const { media } = controller;
      let level = 'high';

      if (!media || typeof media.volume == 'undefined') {
        return level;
      }

      const { muted, volume } = media;

      if (volume === 0 || muted) {
        level = 'off';
      } else if (volume < 0.5) {
        level = 'low';
      } else if (volume < 0.75) {
        level = 'medium';
      }

      return level;
    },
    mediaEvents: ['volumechange'],
  },
  MEDIA_CURRENT_TIME: {
    get: function (controller) {
      const { media } = controller;

      if (!media || typeof media.currentTime == 'undefined') {
        return 0;
      }

      return media.currentTime;
    },
    mediaEvents: ['timeupdate', 'loadedmetadata'],
  },
  MEDIA_DURATION: {
    get: function (controller) {
      const { media } = controller;

      // TODO: What if duration is infinity/live? (heff)
      if (!media || !Number.isFinite(media.duration)) {
        return NaN;
      }

      return media.duration;
    },
    mediaEvents: ['durationchange', 'loadedmetadata', 'emptied'],
  },
  MEDIA_SEEKABLE: {
    // TODO: Returns undefined and a string, consider a better type
    // not tied to attribute strings
    get: function (controller) {
      const { media } = controller;

      if (!media?.seekable?.length) return undefined;

      const start = media.seekable.start(0);
      const end = media.seekable.end(media.seekable.length - 1);

      // Account for cases where metadata from slotted media has an "empty" seekable (CJP)
      if (!start && !end) return undefined;
      return [Number(start.toFixed(3)), Number(end.toFixed(3))].join(':');
    },
    mediaEvents: ['loadedmetadata', 'emptied', 'progress'],
  },
  MEDIA_LOADING: {
    get: function (controller) {
      return !!(controller.media?.readyState < 3);
    },
    mediaEvents: ['waiting', 'playing', 'emptied'],
  },
  MEDIA_BUFFERED: {
    get: function (controller) {
      return serializeTimeRanges(controller.media?.buffered);
    },
    mediaEvents: ['progress', 'emptied'],
  },
  MEDIA_STREAM_TYPE: {
    get: function (controller) {
      const { media } = controller;

      // TODO: Should return default-stream-type in this case if set
      // Reconsider undefined as default otherwise. Feels odd to return it.
      if (!media) return undefined;

      const { streamType } = media;
      if (StreamTypeValues.includes(streamType)) {
        // If the slotted media supports `streamType` but
        // `streamType` is "unknown", prefer `default-stream-type`
        // if set (CJP)
        if (streamType === StreamTypes.UNKNOWN) {
          /** @TODO Move to non attr state and consider adding as a part of a separate "default state" model (CJP) */
          const defaultType = controller.defaultStreamType;
          if ([StreamTypes.LIVE, StreamTypes.ON_DEMAND].includes(defaultType)) {
            return defaultType;
          }
          return undefined;
        }
        return streamType;
      }
      const duration = media.duration;

      if (duration === Infinity) {
        return StreamTypes.LIVE;
      } else if (Number.isFinite(duration)) {
        return StreamTypes.ON_DEMAND;
      } else {
          /** @TODO Move to non attr state and consider adding as a part of a separate "default state" model (CJP) */
        const defaultType = controller.defaultStreamType;

        if ([StreamTypes.LIVE, StreamTypes.ON_DEMAND].includes(defaultType)) {
          return defaultType;
        }
      }

      return undefined;
    },
    mediaEvents: [
      'emptied',
      'durationchange',
      'loadedmetadata',
      'streamtypechange',
    ],
  },
  MEDIA_TARGET_LIVE_WINDOW: {
    get: function (controller) {
      const { media } = controller;

      if (!media) return Number.NaN;
      const { targetLiveWindow } = media;
      const streamType = MediaUIStates.MEDIA_STREAM_TYPE.get(controller);

      // Since `NaN` represents either "unknown" or "inapplicable", need to check if `streamType`
      // is `"live"`. If so, assume it's "standard live" (aka `targetLiveWindow === 0`) (CJP)
      if (
        (targetLiveWindow == null || Number.isNaN(targetLiveWindow)) &&
        streamType === StreamTypes.LIVE
      ) {
        return 0;
      }
      return targetLiveWindow;
    },
    mediaEvents: [
      'emptied',
      'durationchange',
      'loadedmetadata',
      'streamtypechange',
      'targetlivewindowchange',
    ],
  },
  MEDIA_TIME_IS_LIVE: {
    get: function (controller) {
      const { media } = controller;

      if (!media) return false;

      if (typeof media.liveEdgeStart === 'number') {
        if (Number.isNaN(media.liveEdgeStart)) return false;
        return media.currentTime >= media.liveEdgeStart;
      }

      const live = MediaUIStates.MEDIA_STREAM_TYPE.get(controller) === 'live';
      // Can't be playing live if it's not a live stream
      if (!live) return false;

      const seekable = media.seekable;
      // If the slotted media element is live but does not expose a 'seekable' `TimeRanges` object,
      // always assume playing live
      if (!seekable) return true;
      // If there is an empty `seekable`, assume we are not playing live
      if (!seekable.length) return false;

      // Default to 10 seconds
      // Assuming seekable range already accounts for appropriate buffer room
      const liveEdgeStartOffset = controller.liveEdgeOffset
        ? // TODO: Move to no attr value
          Number(controller.liveEdgeOffset)
        : 10;
      const liveEdgeStart =
        seekable.end(seekable.length - 1) - liveEdgeStartOffset;
      return media.currentTime >= liveEdgeStart;
    },
    mediaEvents: ['playing', 'timeupdate', 'progress', 'waiting', 'emptied'],
  },
  MEDIA_IS_FULLSCREEN: {
    get: function (controller, e) {
      // Safari doesn't support ShadowRoot.fullscreenElement and document.fullscreenElement
      // could be several ancestors up the tree. Use event.target instead.
      const isSomeElementFullscreen = !!document[fullscreenApi.element];
      const fullscreenEl = isSomeElementFullscreen && e?.target;
      return containsComposedNode(controller.fullscreenElement, fullscreenEl);
    },
    // TODO: Don't miss this special event type when implementing
    rootEvents: [fullscreenApi.event],
  },
  MEDIA_IS_PIP: {
    get: function (controller, e) {
      const media = controller.media;

      if (!media) return false;

      // Rely on event type for state first
      // in case this doesn't work well for custom elements using internal <video>
      if (e) {
        return e.type == 'enterpictureinpicture';
      } else {
        const pipElement =
          // Might need to use the root of media-container
          // todo: confirm media is ok to pull the root node from!!
          // @ts-ignore
          media.getRootNode().pictureInPictureElement ??
          document.pictureInPictureElement;
        return containsComposedNode(media, pipElement);
      }
    },
    mediaEvents: ['enterpictureinpicture', 'leavepictureinpicture'],
  },
  MEDIA_IS_CASTING: {
    // Note this relies on a customized video[is=castable-video] element.
    get: function (controller, e) {
      const { media } = controller;

      if (!media) return false;

      const castElement = globalThis.CastableVideoElement?.castElement;
      let castState = containsComposedNode(media, castElement);

      // While the cast is connecting set media-is-cast="connecting"
      if (e?.type === 'castchange' && e?.detail === 'CONNECTING') {
        castState = 'connecting';
      }

      return castState;
    },
    mediaEvents: ['entercast', 'leavecast', 'castchange'],
  },
  MEDIA_AIRPLAY_UNAVAILABLE: {
    // NOTE: only adding this if airplay is supported, in part to avoid unnecessary battery consumption per
    // Apple docs recommendations (See: https://developer.apple.com/documentation/webkitjs/adding_an_airplay_button_to_your_safari_media_controls)
    // For a more advanced solution, we could monitor for media state receivers that "care" about airplay support and add/remove
    // whenever these are added/removed. (CJP)
    // NOTE: I don't think only adding this if supported helps, so making this match others.
    // If Airplay's not supported then it it doesn't hurt to add it.
    // If battery is really an issue we need a different approach.
    // Also this is a terrible API, Apple. (heff)
    get: function (controller, e) {
      if (!airplaySupported) return AvailabilityStates.UNSUPPORTED;

      // NOTE: since we invoke all these event handlers without arguments whenever a media is attached,
      // need to account for the possibility that event is undefined (CJP).
      // TODO: Is there reall no way to detect this without an event? (heff)
      if (!e) return undefined;
      // TODO: Switch to non attr specific value

      if (e.availability === 'available') {
        return undefined;
      } else if (e.availability === 'not-available') {
        return AvailabilityStates.UNAVAILABLE;
      }
    },
    mediaEvents: ['webkitplaybacktargetavailabilitychanged'],
  },
  MEDIA_CAST_UNAVAILABLE: {
    get: function () {
      const castState = globalThis.CastableVideoElement?.castState;

      if (!castSupported || !castState) {
        return AvailabilityStates.UNSUPPORTED;
      }

      // Cast state: NO_DEVICES_AVAILABLE, NOT_CONNECTED, CONNECTING, CONNECTED
      if (castState.includes('CONNECT')) {
        // TODO: Move to non attr specific value
        return undefined;
      } else {
        return AvailabilityStates.UNAVAILABLE;
      }
    },
    mediaEvents: ['castchange'],
  },
  MEDIA_FULLSCREEN_UNAVAILABLE: {
    get: function () {
      // TODO: Move to non attr specific value
      return fullscreenSupported ? undefined : AvailabilityStates.UNAVAILABLE;
    },
  },
  MEDIA_PIP_UNAVAILABLE: {
    get: function () {
      // TODO: Move to non attr specific value
      return pipSupported ? undefined : AvailabilityStates.UNSUPPORTED;
    },
  },
  MEDIA_VOLUME_UNAVAILABLE: {
    get: function (controller) {
      if (volumeSupported !== undefined && !volumeSupported) {
        return AvailabilityStates.UNSUPPORTED;
      }

      const { media } = controller;

      if (media && typeof media.volume == 'undefined') {
        return AvailabilityStates.UNAVAILABLE;
      }

      // TODO: move to non attr specific value
      return undefined;
    },
    // Give a little time for the volume support promise to run
    mediaEvents: ['loadstart'],
  },
  MEDIA_SUBTITLES_LIST: {
    get: function (controller) {
      // TODO: Move to non attr specific values
      return stringifyTextTrackList(getSubtitleTracks(controller)) || undefined;
    },
    mediaEvents: ['loadstart'],
    trackListEvents: ['addtrack', 'removetrack'],
  },
  MEDIA_SUBTITLES_SHOWING: {
    get: function (controller) {
      // TODO: Move to non attr specific values
      return (
        stringifyTextTrackList(getShowingSubtitleTracks(controller)) ||
        undefined
      );
    },
    mediaEvents: ['loadstart'],
    trackListEvents: ['addtrack', 'removetrack', 'change'],
  },
};

// Capture request events from UI elements and tranlate to actions
const MediaUIRequestHandlers = {
  MEDIA_PLAY_REQUEST: (media, e, controller) => {
    const streamType = MediaUIStates.MEDIA_STREAM_TYPE.get(controller);
    // TODO: Move to not attr value
    const autoSeekToLive = controller.noAutoSeekToLive === null;

    if (streamType == StreamTypes.LIVE && autoSeekToLive) {
      MediaUIRequestHandlers['MEDIA_SEEK_TO_LIVE_REQUEST'](media);
    }

    media.play().catch(() => {});
  },
  MEDIA_PAUSE_REQUEST: (media) => media.pause(),
  MEDIA_MUTE_REQUEST: (media) => (media.muted = true),
  MEDIA_UNMUTE_REQUEST: (media) => {
    media.muted = false;

    // Avoid confusion by bumping the volume on unmute
    if (media.volume === 0) {
      media.volume = 0.25;
    }
  },
  MEDIA_VOLUME_REQUEST: (media, e) => {
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
    } catch (err) {
      // ignore
    }
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
  MEDIA_ENTER_FULLSCREEN_REQUEST: (media, e, controller) => {
    if (!fullscreenSupported) {
      console.warn(
        'Fullscreen support is unavailable; not entering fullscreen'
      );
      return;
    }

    if (document.pictureInPictureElement) {
      // Should be async
      document.exitPictureInPicture();
    }

    // TODO: Moved from super to just controller, verify that works
    if (controller.fullscreenElement[fullscreenApi.enter]) {
      // Media chrome container fullscreen
      controller.fullscreenElement[fullscreenApi.enter]();
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
  MEDIA_ENTER_PIP_REQUEST: (media) => {
    if (!document.pictureInPictureEnabled) {
      console.warn('MediaChrome: Picture-in-picture is not enabled');
      // Placeholder for emitting a user-facing warning
      return;
    }

    if (!media.requestPictureInPicture) {
      console.warn(
        'MediaChrome: The current media does not support picture-in-picture'
      );
      // Placeholder for emitting a user-facing warning
      return;
    }

    // Exit fullscreen if needed
    if (document[fullscreenApi.element]) {
      document[fullscreenApi.exit]();
    }

    const warnNotReady = () => {
      console.warn(
        'MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.'
      );
    };

    media.requestPictureInPicture().catch((err) => {
      // InvalidStateError, readyState == 0 (Not ready)
      if (err.code === 11) {
        // We can assume the viewer wants the video to load, so attempt to
        // if we can rely on readyState and preload
        // Only works in Chrome currently. Safari doesn't allow triggering
        // in an event listener. Also requires readyState == 4.
        // Firefox doesn't have the PiP API yet.
        if (media.readyState === 0 && media.preload === 'none') {
          const cleanup = () => {
            media.removeEventListener('loadedmetadata', tryPip);
            media.preload = 'none';
          };

          const tryPip = () => {
            media.requestPictureInPicture().catch(warnNotReady);
            cleanup();
          };

          media.addEventListener('loadedmetadata', tryPip);
          media.preload = 'metadata';

          // No easy way to know if this failed and we should clean up
          // quickly if it doesn't to prevent an awkward delay for the user
          setTimeout(() => {
            if (media.readyState === 0) warnNotReady();
            cleanup();
          }, 1000);
        } else {
          // Rethrow if unknown context
          throw err;
        }
      } else {
        // Rethrow if unknown context
        throw err;
      }
    });
  },
  MEDIA_EXIT_PIP_REQUEST: () => {
    if (document.pictureInPictureElement) {
      // Should be async
      document.exitPictureInPicture();
    }
  },
  MEDIA_ENTER_CAST_REQUEST: (media) => {
    if (!globalThis.CastableVideoElement?.castEnabled) return;

    // Exit fullscreen if needed
    if (document[fullscreenApi.element]) {
      document[fullscreenApi.exit]();
    }

    // Open the browser cast menu.
    // Note this relies on a customized video[is=castable-video] element.
    media.requestCast();
  },
  MEDIA_EXIT_CAST_REQUEST: async () => {
    if (globalThis.CastableVideoElement?.castElement) {
      globalThis.CastableVideoElement.exitCast();
    }
  },
  MEDIA_SEEK_REQUEST: (media, e) => {
    const time = e.detail;

    // Can't set the time before the media is ready
    // Ignore if readyState isn't supported
    if (media.readyState > 0 || media.readyState === undefined) {
      media.currentTime = time;
    }
  },
  MEDIA_PLAYBACK_RATE_REQUEST: (media, e) => {
    media.playbackRate = e.detail;
  },
  MEDIA_PREVIEW_REQUEST: (media, e, controller) => {
    // No media (yet), so bail early
    if (!media) return;

    // TODO: these propagateMediaState have to replaced with event dispatch
    // and retrieving state. return early for this POC to hide type errors.
    if (!controller.propagateMediaState) return;

    const time = e.detail;

    // if time is null, then we're done previewing and want to remove the attributes
    if (time === null) {
      controller.propagateMediaState(
        MediaUIAttributes.MEDIA_PREVIEW_TIME,
        undefined
      );
    }
    controller.propagateMediaState(MediaUIAttributes.MEDIA_PREVIEW_TIME, time);

    const [track] = getTextTracksList(media, {
      kind: TextTrackKinds.METADATA,
      label: 'thumbnails',
    });
    // No thumbnails track (yet) or no cues available in thumbnails track, so bail early.
    if (!(track && track.cues)) return;

    // if time is null, then we're done previewing and want to remove the attributes
    if (time === null) {
      controller.propagateMediaState(
        MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
        undefined
      );
      controller.propagateMediaState(
        MediaUIAttributes.MEDIA_PREVIEW_COORDS,
        undefined
      );
      return;
    }

    const cue = Array.prototype.find.call(
      track.cues,
      (c) => c.startTime >= time
    );

    // No corresponding cue, so bail early
    if (!cue) return;

    // Since this isn't really "global state", we may want to consider moving this "down" to the component level,
    // probably pulled out into its own module/set of functions (CJP)
    const base = !/'^(?:[a-z]+:)?\/\//i.test(cue.text)
      ? // @ts-ignore
        media.querySelector('track[label="thumbnails"]')?.src
      : undefined;
    const url = new URL(cue.text, base);
    const previewCoordsStr = new URLSearchParams(url.hash).get('#xywh');
    controller.propagateMediaState(
      MediaUIAttributes.MEDIA_PREVIEW_IMAGE,
      url.href
    );
    controller.propagateMediaState(
      MediaUIAttributes.MEDIA_PREVIEW_COORDS,
      previewCoordsStr.split(',').join(' ')
    );
  },
  MEDIA_SHOW_SUBTITLES_REQUEST: (media, e, controller) => {
    const tracks = getSubtitleTracks(controller);
    const { detail: tracksToUpdate = [] } = e;
    updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
  },
  MEDIA_DISABLE_SUBTITLES_REQUEST: (media, e, controller) => {
    const tracks = getSubtitleTracks(controller);
    const { detail: tracksToUpdate = [] } = e;
    updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
  },
  MEDIA_AIRPLAY_REQUEST: (media) => {
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
  MEDIA_SEEK_TO_LIVE_REQUEST: (media) => {
    const seekable = media.seekable;

    if (!seekable) {
      console.warn(
        'MediaController: Media element does not support seeking to live.'
      );
      return;
    }

    if (!seekable.length) {
      console.warn('MediaController: Media is unable to seek to live.');
      return;
    }

    media.currentTime = seekable.end(seekable.length - 1);
  },
};

const mediaUIEventToKeyMap =
  Object.fromEntries(Object.entries(MediaUIEvents)
    .map(([key, value]) => [value, key]))

const mediaStateEventToKeyMap = {};
for (let stateKey in MediaUIStates) {
  const { rootEvents = [], mediaEvents = [], trackListEvents = [] } = MediaUIStates[stateKey];
  const allEvents = [...rootEvents, ...mediaEvents, ...trackListEvents];
  for (let event of allEvents) {
    if (!mediaStateEventToKeyMap[event]) mediaStateEventToKeyMap[event] = [];
    mediaStateEventToKeyMap[event].push(stateKey);
  }
}

export default class MediaController extends EventTarget {

  /** @type {HTMLVideoElement} */
  #media;
  #changedState = {};

  // todo set these from MediaChromeElement!!
  fullscreenElement;
  liveEdgeOffset;
  defaultStreamType;
  noAutoSeekToLive;

  constructor(media) {
    super();
    this.media = media;

    Object.keys(MediaUIEvents)
      .forEach(key => this.addEventListener(MediaUIEvents[key], this));

    // Update volume support ASAP
    if (MediaUIStates.MEDIA_VOLUME_UNAVAILABLE.get(this) === undefined) {
      // NOTE: In order to propagate ASAP, we currently need to ensure that
      // the volume support promise has resolved. Given the async nature of
      // some of these environment state values, we may want to model this
      // a bit better (CJP).
      volumeSupportPromise.then(() => {
        // TODO: dispatch an event here to initiate a state propagation
        // in the media controller element

        // this.propagateMediaState(
        //   MediaUIAttributes.MEDIA_VOLUME_UNAVAILABLE,
        //   MediaUIStates.MEDIA_VOLUME_UNAVAILABLE.get(this)
        // );
      });
    }
  }

  get media() {
    return this.#media;
  }

  set media(media) {

    if (!media) {

      // Remove all state change propagators
      Object.keys(MediaUIStates).forEach((key) => {
        const {
          mediaEvents,
          rootEvents,
          trackListEvents
        } = MediaUIStates[key];

        mediaEvents?.forEach((eventName) => {
          this.media?.removeEventListener(eventName, this);
        });

        rootEvents?.forEach((eventName) => {
          // todo: confirm media is ok to pull the root node from
          this.media?.getRootNode().removeEventListener(eventName, this);
        });

        trackListEvents?.forEach((eventName) => {
          this.media?.textTracks?.removeEventListener(eventName, this);
        });
      });

      this.#media = null;
      return;
    }

    this.#media = media;

    // Listen for media state changes and propagate them to children and associated els
    Object.keys(MediaUIStates).forEach((key) => {
      const {
        mediaEvents,
        rootEvents,
        trackListEvents
      } = MediaUIStates[key];

      mediaEvents?.forEach((eventName) => {
        this.media.addEventListener(eventName, this);
      });

      rootEvents?.forEach((eventName) => {
        // todo: confirm media is ok to pull the root node from
        this.media.getRootNode().addEventListener(eventName, this);
      });

      trackListEvents?.forEach((eventName) => {
        this.media.textTracks?.addEventListener(eventName, this);
      });
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

  handleEvent(event) {
    console.log(event);

    // handle incoming request events
    const mediaUIEventKey = mediaUIEventToKeyMap[event.type];

    if (mediaUIEventKey) {
      MediaUIRequestHandlers[mediaUIEventKey](this.media, event, this);
      return;
    }

    this.#changedState = {};
    for (let stateKey of mediaStateEventToKeyMap[event.type]) {
      this.#changedState[constToCamel(stateKey)] = MediaUIStates[stateKey].get(this, event);
    }

    console.log(this.#changedState);

    // forward media change events
    this.dispatchEvent(new CustomEvent('mediachange'));
    this.dispatchEvent(new CustomEvent(event.type));
  }

  getChangedState() {
    return Object.freeze(this.#changedState);
  }

  getState() {
    let state = {};
    for (let key in MediaUIStates) {
      state[constToCamel(key)] = MediaUIStates[key].get(this);
    }
    return Object.freeze(state);
  }

  toJSON() {
    return this.getState();
  }
}
