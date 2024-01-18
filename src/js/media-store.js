import { document, globalThis } from './utils/server-safe-globals.js';
import {
  AvailabilityStates,
  MediaUIEvents,
  StreamTypes,
  TextTrackKinds,
  TextTrackModes,
} from './constants.js';
import {
  getTextTracksList,
  parseTracks,
  updateTracksModeTo,
} from './utils/captions.js';
import { containsComposedNode } from './utils/element-utils.js';
import { fullscreenApi } from './utils/fullscreen-api.js';
import {
  airplaySupported,
  castSupported,
  fullscreenSupported,
  hasFullscreenSupport,
  hasPipSupport,
  hasVolumeSupportAsync,
  pipSupported,
} from './utils/platform-tests.js';

/**
 * @typedef {'on-demand'|'live'|'unknown'} StreamTypeValue
 */

/**
 * @typedef {'unavailable'|'unsupported'} AvailabilityTypeValue
 */

/**
 * @typedef {Partial<HTMLVideoElement> & Pick<HTMLMediaElement,'play'> & {
 *  streamType?: StreamTypeValue;
 *  targetLiveWindow?: number;
 *  liveEdgeStart?: number;
 *  videoRenditions?: { id?: any; }[] & EventTarget & { selectedIndex?: number };
 *  audioTracks?: { id?: any; enabled?: boolean; }[] & EventTarget;
 *  requestCast?: () => any;
 *  webkitDisplayingFullscreen?: boolean;
 *  webkitPresentationMode?: 'fullscreen'|'picture-in-picture';
 *  webkitEnterFullscreen?: () => any;
 *  webkitCurrentPlaybackTargetIsWireless?: boolean;
 *  webkitShowPlaybackTargetPicker?: () => any;
 * }} MediaStateOwner
 */

/**
 * @typedef {Partial<Document|ShadowRoot>} RootNodeStateOwner
 */

/**
 * @typedef {Partial<HTMLElement> & EventTarget} FullScreenElementStateOwner
 */

/**
 * @typedef {object} MediaStoreOptions
 * @property {boolean} [defaultSubtitles]
 * @property {StreamTypeValue} [defaultStreamType]
 * @property {number} [defaultDuration]
 * @property {number} [liveEdgeOffset]
 * @property {boolean} [noVolumePref]
 * @property {boolean} [noSubtitlesLangPref]
 */

/**
 * @typedef {object} StateOwners
 * @property {MediaStateOwner} [media]
 * @property {RootNodeStateOwner} [rootNode]
 * @property {FullScreenElementStateOwner} [fullscreenElement]
 * @property {MediaStoreOptions} [options]
 */

/**
 * @typedef {{ type: Event['type']; detail?: D; target?: Event['target'] }} EventOrAction<D>
 * @template {any} [D=undefined]
 */

/**
 * @typedef {(stateOwners: StateOwners, event?: EventOrAction<D>) => T} FacadeGetter<T>
 * @template T
 * @template {any} [D=T]
 */

/**
 * @typedef {(value: T, stateOwners: StateOwners) => void} FacadeSetter<T>
 * @template T
 */

/**
 * @typedef {(handler: (value: T) => void, stateOwners: StateOwners) => void} StateOwnerUpdateHandler<T>
 * @template T
 */

/**
 * @typedef {{
 *   get: FacadeGetter<T,D>;
 *   mediaEvents?: string[];
 *   textTracksEvents?: string[];
 *   videoRenditionsEvents?: string[];
 *   audioTracksEvents?: string[];
 *   rootEvents?: string[];
 *   remoteEvents?: string[];
 *   stateOwnersUpdateHandlers?: StateOwnerUpdateHandler<T>[];
 * }} ReadOnlyFacadeProp<T>
 * @template T
 * @template {any} [D=T]
 */

/**
 * @typedef {ReadOnlyFacadeProp<T,D> & { set: FacadeSetter<S> }} FacadeProp<T,S,D>
 * @template T
 * @template {any} [S=T]
 * @template {any} [D=T]
 */

/**
 * has src
 *  has src loaded
 *
 */

/**
 * @typedef {{
 *   mediaPaused: FacadeProp<HTMLMediaElement['paused']>
 *   mediaHasPlayed: ReadOnlyFacadeProp<boolean>;
 *   mediaEnded: ReadOnlyFacadeProp<HTMLMediaElement['ended']>;
 *   mediaPlaybackRate: FacadeProp<HTMLMediaElement['playbackRate']>;
 *   mediaMuted: FacadeProp<HTMLMediaElement['muted']>;
 *   mediaVolume: FacadeProp<HTMLMediaElement['volume']>;
 *   mediaVolumeLevel: ReadOnlyFacadeProp<'high'|'medium'|'low'|'off'>
 *   mediaCurrentTime: FacadeProp<HTMLMediaElement['currentTime']>;
 *   mediaDuration: ReadOnlyFacadeProp<HTMLMediaElement['duration']>;
 *   mediaLoading: ReadOnlyFacadeProp<boolean>;
 *   mediaSeekable: ReadOnlyFacadeProp<[number, number]|undefined>;
 *   mediaBuffered: ReadOnlyFacadeProp<[number, number][]>;
 *   mediaStreamType: ReadOnlyFacadeProp<StreamTypeValue>;
 *   mediaTargetLiveWindow: ReadOnlyFacadeProp<number>;
 *   mediaTimeIsLive: ReadOnlyFacadeProp<boolean>;
 *   mediaSubtitlesList: ReadOnlyFacadeProp<Pick<TextTrack,'kind'|'label'|'language'>[]>;
 *   mediaSubtitlesShowing: ReadOnlyFacadeProp<Pick<TextTrack,'kind'|'label'|'language'>[]>;
 *   mediaIsPip: FacadeProp<boolean>;
 *   mediaRenditionList: ReadOnlyFacadeProp<{ id?: string }[]>;
 *   mediaRenditionSelected: FacadeProp<{ id?: string }[],string>;
 *   mediaAudioTrackList: ReadOnlyFacadeProp<{ id?: string }[]>;
 *   mediaAudioTrackEnabled: FacadeProp<{ id?: string }[],string>;
 *   mediaIsFullscreen: FacadeProp<boolean>;
 *   mediaIsCasting: FacadeProp<boolean,boolean,'NO_DEVICES_AVAILABLE'|'NOT_CONNECTED'|'CONNECTING'|'CONNECTED'>;
 *   mediaIsAirplaying: FacadeProp<boolean>;
 *   mediaFullscreenUnavailable: ReadOnlyFacadeProp<AvailabilityTypeValue|undefined>;
 *   mediaPipUnavailable: ReadOnlyFacadeProp<AvailabilityTypeValue|undefined>;
 *   mediaVolumeUnavailable: ReadOnlyFacadeProp<AvailabilityTypeValue|undefined>;
 *   mediaCastUnavailable: ReadOnlyFacadeProp<AvailabilityTypeValue|undefined>;
 *   mediaAirplayUnavailable: ReadOnlyFacadeProp<AvailabilityTypeValue|undefined>;
 *   mediaRenditionUnavailable: ReadOnlyFacadeProp<AvailabilityTypeValue|undefined>;
 *   mediaAudioTrackUnavailable: ReadOnlyFacadeProp<AvailabilityTypeValue|undefined>;
 * }} StateFacade
 */

/**
 * @typedef {{
 *   [K in keyof StateFacade]: ReturnType<StateFacade[K]['get']>
 * } & {
 *   mediaPreviewTime: number;
 *   mediaPreviewImage: string;
 *   mediaPreviewCoords: [string,string,string,string]
 * }} MediaState
 */

/**
 * @typedef {{
 *   dispatch: (eventOrAction: EventOrAction<any>) => void;
 *   getState: () => Partial<MediaState>;
 *   subscribe: (handler: (state: Partial<MediaState>) => void) => (() => void)
 * }} MediaStore;
 */

/** @TODO Move to util module (CJP) */
export const getSubtitleTracks = (stateOwners) => {
  return getTextTracksList(stateOwners.media, (textTrack) => {
    return [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(
      textTrack.kind
    );
  }).sort((a, b) => (a.kind >= b.kind ? 1 : -1));
};

/** @TODO Move to util module (CJP) */
export const getShowingSubtitleTracks = (stateOwners) => {
  return getTextTracksList(stateOwners.media, (textTrack) => {
    return (
      textTrack.mode === TextTrackModes.SHOWING &&
      [TextTrackKinds.SUBTITLES, TextTrackKinds.CAPTIONS].includes(
        textTrack.kind
      )
    );
  });
};

/** @TODO Move to util module (CJP) */
export const toggleSubtitleTracks = (stateOwners, force) => {
  // NOTE: Like Element::toggleAttribute(), this event uses the detail for an optional "force"
  // value. When present, this means "toggle to" "on" (aka showing, even if something's already showing)
  // or "off" (aka disabled, even if all tracks are currently disabled).
  // See, e.g.: https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute#force (CJP)

  const tracks = getSubtitleTracks(stateOwners);
  const showingSubitleTracks = getShowingSubtitleTracks(stateOwners);
  const subtitlesShowing = !!showingSubitleTracks.length;
  // If there are no tracks, this request doesn't matter, so we're done.
  // If we already have showing subtitles and we want to force toggle "on", there's nothing left to do.
  // If there are no showing subtitles and we want to force toggle "off", we're already done.
  if (
    !tracks.length ||
    (subtitlesShowing && force) ||
    (!subtitlesShowing && force === false)
  )
    return;

  if (subtitlesShowing) {
    updateTracksModeTo(TextTrackModes.DISABLED, tracks, showingSubitleTracks);
  } else {
    const { options } = stateOwners;
    let subTrack = tracks[0];
    if (!options.noSubtitlesLangPref) {
      const subtitlesPref = globalThis.localStorage.getItem(
        'media-chrome-pref-subtitles-lang'
      );

      const userLangPrefs = subtitlesPref
        ? [subtitlesPref, ...globalThis.navigator.languages]
        : globalThis.navigator.languages;
      const preferredAvailableSubs = tracks
        .filter((textTrack) => {
          return userLangPrefs.some((lang) =>
            textTrack.language.toLowerCase().startsWith(lang.split('-')[0])
          );
        })
        .sort((textTrackA, textTrackB) => {
          const idxA = userLangPrefs.findIndex((lang) =>
            textTrackA.language.toLowerCase().startsWith(lang.split('-')[0])
          );
          const idxB = userLangPrefs.findIndex((lang) =>
            textTrackB.language.toLowerCase().startsWith(lang.split('-')[0])
          );
          return idxA - idxB;
        });

      // Since there may not have been any user preferred subs/cc match, keep the default (picking the first) as
      // the subtitle track to show for these cases.
      if (preferredAvailableSubs[0]) {
        subTrack = preferredAvailableSubs[0];
      }
    }
    const { language, label, kind } = subTrack;
    updateTracksModeTo(TextTrackModes.SHOWING, tracks, [
      { language, label, kind },
    ]);
  }
};

/** @TODO Move to util module (CJP) */
export const areValuesEq = (x, y) => {
  // If both are strictly equal, they're equal
  if (x === y) return true;
  // If their types don't match, they're not equal
  if (typeof x !== typeof y) return false;
  // Treat NaNs as equal
  if (typeof x === 'number' && Number.isNaN(x) && Number.isNaN(y)) return true;
  // NOTE: This impl does not support function values (CJP)
  // All other "simple" types are not equal, since they have the same type and were not strictly equal
  if (typeof x !== 'object') return false;
  if (Array.isArray(x)) return areArraysEq(x, y);
  // NOTE: This impl currently assumes that if y[key] -> x[key] (aka no "extra" keys in y) (CJP)
  // For objects, if every key's value in x has a corresponding key/value entry in y, the objects are equal
  return Object.entries(x).every(
    // NOTE: Checking key in y to disambiguate between between missing keys and keys whose value are undefined (CJP)
    ([key, value]) => key in y && areValuesEq(value, y[key])
  );
};

/** @TODO Move to util module (CJP) */
export const areArraysEq = (xs, ys) => {
  const xIsArray = Array.isArray(xs);
  const yIsArray = Array.isArray(ys);
  // If one of the "arrays" is not an array, not equal
  if (xIsArray !== yIsArray) return false;
  // If both of the "arrays" are not arrays, equal
  if (!(xIsArray || yIsArray)) return true;
  // If arrays have different length, not equal
  if (xs.length !== ys.length) return false;
  // NOTE: presuming sort order is equivalent (CJP)
  // If and only every corresponding entry between the arrays is equal, arrays are equal
  return xs.every((x, i) => areValuesEq(x, ys[i]));
};

const StreamTypeValues = /** @type {StreamTypeValue[]} */ (
  Object.values(StreamTypes)
);

let volumeSupported;
export const volumeSupportPromise = hasVolumeSupportAsync().then(
  (supported) => {
    volumeSupported = supported;
    return volumeSupported;
  }
);

/** @type {StateFacade} */
export const defaultStateFacade = {
  mediaPaused: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.paused ?? true;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
      if (value) {
        media.pause();
      } else {
        media.play().catch(() => {});
      }
    },
    mediaEvents: ['play', 'playing', 'pause', 'emptied'],
  },
  mediaHasPlayed: {
    // We want to let the user know that the media started playing at any point (`media-has-played`).
    // Since these propagators are all called when boostrapping state, let's verify this is
    // a real playing event by checking that 1) there's media and 2) it isn't currently paused.
    get: function (stateOwners, event) {
      const { media } = stateOwners;

      if (!media) return false;
      if (!event) return !media.paused;
      return event.type === 'playing';
    },
    mediaEvents: ['playing', 'emptied'],
  },
  mediaEnded: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.ended ?? false;
    },
    mediaEvents: ['seeked', 'ended', 'emptied'],
  },
  mediaPlaybackRate: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.playbackRate ?? 1;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
      media.playbackRate = value;
    },
    mediaEvents: ['ratechange', 'loadstart'],
  },
  mediaMuted: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.muted ?? false;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
      media.muted = value;
    },
    mediaEvents: ['volumechange'],
  },
  mediaVolume: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.volume ?? 1.0;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
      // Store the last set volume as a local preference, if ls is supported
      /** @TODO How should we handle globalThis dependencies/"state ownership"? (CJP) */
      try {
        if (value == null) {
          globalThis.localStorage.removeItem('media-chrome-pref-volume');
        } else {
          globalThis.localStorage.setItem(
            'media-chrome-pref-volume',
            value.toString()
          );
        }
      } catch (err) {
        // ignore
      }
      media.volume = value;
    },
    mediaEvents: ['volumechange'],
    stateOwnersUpdateHandlers: [
      (handler, stateOwners) => {
        const {
          options: { noVolumePref },
        } = stateOwners;
        if (noVolumePref) return;
        /** @TODO How should we handle globalThis dependencies/"state ownership"? (CJP) */
        try {
          const volumePref = globalThis.localStorage.getItem(
            'media-chrome-pref-volume'
          );
          if (volumePref == null) return;
          defaultStateFacade.mediaVolume.set(+volumePref, stateOwners);
          handler(volumePref);
        } catch (e) {
          console.debug('Error getting volume pref', e);
        }
      },
    ],
  },
  // NOTE: Keeping this roughly equivalent to prior impl to reduce number of changes,
  // however we may want to model "derived" state differently from "primary" state
  // (in this case, derived === mediaVolumeLevel, primary === mediaMuted, mediaVolume) (CJP)
  mediaVolumeLevel: {
    get(stateOwners) {
      const { media } = stateOwners;
      if (typeof media?.volume == 'undefined') return 'high';
      if (media.muted || media.volume === 0) return 'off';
      if (media.volume < 0.5) return 'low';
      if (media.volume < 0.75) return 'medium';
      return 'high';
    },
    mediaEvents: ['volumechange'],
  },
  mediaCurrentTime: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.currentTime ?? 0;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      // Can't set the time before the media is ready
      // Ignore if readyState isn't supported
      if (!media?.readyState) return;
      media.currentTime = value;
    },
    mediaEvents: ['timeupdate', 'loadedmetadata'],
  },
  mediaDuration: {
    get(stateOwners) {
      const {
        media,
        options: { defaultDuration },
      } = stateOwners;

      // If `defaultduration` is set and we don't yet have a usable `duration`
      // available, use the default duration.
      if (
        defaultDuration &&
        (!media ||
          !media.duration ||
          Number.isNaN(media.duration) ||
          !Number.isFinite(media.duration))
      ) {
        return defaultDuration;
      }

      return Number.isFinite(media?.duration) ? media.duration : Number.NaN;
    },
    mediaEvents: ['durationchange', 'loadedmetadata', 'emptied'],
  },
  mediaLoading: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.readyState < 3;
    },
    mediaEvents: ['waiting', 'playing', 'emptied'],
  },
  mediaSeekable: {
    get(stateOwners) {
      const { media } = stateOwners;

      if (!media?.seekable?.length) return undefined;

      const start = media.seekable.start(0);
      const end = media.seekable.end(media.seekable.length - 1);

      // Account for cases where metadata from slotted media has an "empty" seekable (CJP)
      if (!start && !end) return undefined;
      return [Number(start.toFixed(3)), Number(end.toFixed(3))];
    },
    mediaEvents: ['loadedmetadata', 'emptied', 'progress'],
  },
  mediaBuffered: {
    get(stateOwners) {
      const { media } = stateOwners;

      const timeRanges = /** @type {TimeRanges} */ (media?.buffered ?? []);
      return Array.from(
        /** @type {ArrayLike<any>} */ (/** @type unknown */ (timeRanges))
      ).map((_, i) => [
        Number(timeRanges.start(i).toFixed(3)),
        Number(timeRanges.end(i).toFixed(3)),
      ]);
    },
    mediaEvents: ['progress', 'emptied'],
  },
  mediaStreamType: {
    get: function (stateOwners) {
      const {
        media,
        options: { defaultStreamType },
      } = stateOwners;

      const usedDefaultStreamType = [
        StreamTypes.LIVE,
        StreamTypes.ON_DEMAND,
      ].includes(/** @type {'live'|'on-demand'} */ (defaultStreamType))
        ? defaultStreamType
        : undefined;

      if (!media) return usedDefaultStreamType;

      const { streamType } = media;
      if (StreamTypeValues.includes(streamType)) {
        // If the slotted media supports `streamType` but
        // `streamType` is "unknown", prefer `usedDefaultStreamType`
        // if set (CJP)
        if (streamType === StreamTypes.UNKNOWN) {
          return usedDefaultStreamType;
        }
        return streamType;
      }
      const duration = media.duration;

      if (duration === Infinity) {
        return StreamTypes.LIVE;
      } else if (Number.isFinite(duration)) {
        return StreamTypes.ON_DEMAND;
      }

      return usedDefaultStreamType;
    },
    mediaEvents: [
      'emptied',
      'durationchange',
      'loadedmetadata',
      'streamtypechange',
    ],
  },
  mediaTargetLiveWindow: {
    get: function (stateOwners) {
      const { media } = stateOwners;

      if (!media) return Number.NaN;
      const { targetLiveWindow } = media;
      const streamType = defaultStateFacade.mediaStreamType.get(stateOwners);

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
  mediaTimeIsLive: {
    get: function (stateOwners) {
      const {
        media,
        // Default to 10 seconds
        options: { liveEdgeOffset = 10 },
      } = stateOwners;

      if (!media) return false;

      if (typeof media.liveEdgeStart === 'number') {
        if (Number.isNaN(media.liveEdgeStart)) return false;
        return media.currentTime >= media.liveEdgeStart;
      }

      const live =
        defaultStateFacade.mediaStreamType.get(stateOwners) ===
        StreamTypes.LIVE;
      // Can't be playing live if it's not a live stream
      if (!live) return false;

      // Should this use `defaultStateFacade.mediaSeekable.get(stateOwners)?.[1]` for separation
      // of concerns/assumptions? (CJP)
      const seekable = media.seekable;
      // If the slotted media element is live but does not expose a 'seekable' `TimeRanges` object,
      // always assume playing live
      if (!seekable) return true;
      // If there is an empty `seekable`, assume we are not playing live
      if (!seekable.length) return false;
      const liveEdgeStart = seekable.end(seekable.length - 1) - liveEdgeOffset;
      return media.currentTime >= liveEdgeStart;
    },
    mediaEvents: ['playing', 'timeupdate', 'progress', 'waiting', 'emptied'],
  },
  // Text Tracks modeling
  mediaSubtitlesList: {
    get(stateOwners) {
      return getSubtitleTracks(stateOwners).map(
        ({ kind, label, language }) => ({ kind, label, language })
      );
    },
    mediaEvents: ['loadstart'],
    textTracksEvents: ['addtrack', 'removetrack'],
  },
  mediaSubtitlesShowing: {
    get: function (stateOwners) {
      return getShowingSubtitleTracks(stateOwners).map(
        ({ kind, label, language }) => ({ kind, label, language })
      );
    },
    mediaEvents: ['loadstart'],
    textTracksEvents: ['addtrack', 'removetrack', 'change'],
    stateOwnersUpdateHandlers: [
      // This update handler is responsible for handling "defaultSubtitles" logic
      (handler, stateOwners) => {
        const { media } = stateOwners;
        if (!media?.textTracks) return;
        const checkAndUpdateShowingTracksCallback = () => {
          // If we do not currently want `defaultSubtitles`, there's nothing to do here.
          // NOTE: We do not destructure the `defaultSubtitles` value so that we can rely
          // on updates to the `stateOwners` object, allowing us to support
          // changes to `defaultSubtitles` after initialization and its value will still
          // be respected. This is only a concern with `stateOwnersUpdateHandlers`, since,
          // unlike e.g. our `get()`/`set()` methods, `stateOwnersUpdateHandlers` are only
          // invoked during initialization/updates to the state owners in the media store.
          // See `optionschangerequest` handling logic in the media store's
          // `dispatch()`, below, for more context. (CJP)
          if (!stateOwners.options.defaultSubtitles) return false;
          toggleSubtitleTracks(stateOwners, true);
          /** @TODO Can improve this for async cases to continue updating until preferred (localStorage) lang is selected (CJP) */
          const nextMediaSubtitlesShowing =
            defaultStateFacade.mediaSubtitlesShowing.get(stateOwners);
          const defaultSelectionPending = !nextMediaSubtitlesShowing.length;
          if (!defaultSelectionPending) {
            handler(nextMediaSubtitlesShowing);
          }
          // If true, this means we still may need to set a subtitle/captions track to "showing"
          return defaultSelectionPending;
        };

        const trackAddedCallback = () => {
          const defaultSelectionPending = checkAndUpdateShowingTracksCallback();
          if (defaultSelectionPending) return;

          // If we selected a default subtitle (via side effect), we can now remove this event handler.
          // If the media's src is changed, we will re-add it when "loadstart" is handled (See below)
          media.textTracks.removeEventListener('addtrack', trackAddedCallback);
        };

        const mediaLoadStartCallback = () => {
          // Either a subtitle/captions track was already showing, or we've already selected one (via side effect),
          // so nothing left to do for this media src.
          const defaultSelectionPending = checkAndUpdateShowingTracksCallback();
          if (!defaultSelectionPending) return;

          // However, we may still get tracks added asynchronously (e.g. for HAS media such as HLS/DASH),
          // so monitor for a subtitle/captions track being added.
          // NOTE: Since there may be tracks other than subtitless/captions added, we cannot rely on `{ once: true }` option. (CJP)
          media.textTracks.addEventListener('addtrack', trackAddedCallback);
        };

        media.addEventListener('loadstart', mediaLoadStartCallback);

        // Since the media src may have already been loaded, we should also check/update immediately.
        checkAndUpdateShowingTracksCallback();
        return () => {
          media.removeEventListener('loadstart', mediaLoadStartCallback);
          media.textTracks.removeEventListener('addtrack', trackAddedCallback);
        };
      },
    ],
  },
  // Modeling state tied to root node
  mediaIsPip: {
    get: function (stateOwners, event) {
      const { media, rootNode = document } = stateOwners;

      if (!media || !rootNode) return false;
      if (event) {
        return event.type == 'enterpictureinpicture';
      }

      return containsComposedNode(media, rootNode.pictureInPictureElement);
    },
    set: function (value, stateOwners) {
      const { media } = stateOwners;
      if (value) {
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
        const warnNotReady = () => {
          console.warn(
            'MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.'
          );
        };

        // Should be async
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
              /** @TODO Should we actually rethrow? Feels like something we could log instead for improved devex (CJP) */
              // Rethrow if unknown context
              throw err;
            }
          } else {
            /** @TODO Should we actually rethrow? Feels like something we could log instead for improved devex (CJP) */
            // Rethrow if unknown context
            throw err;
          }
        });
      } else if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    },
    mediaEvents: ['enterpictureinpicture', 'leavepictureinpicture'],
  },
  mediaRenditionList: {
    get: function (stateOwners) {
      const { media } = stateOwners;
      // NOTE: Copying for reference considerations (should be an array of POJOs from a state perspective) (CJP)
      return [...(media?.videoRenditions ?? [])].map((videoRendition) => ({
        ...videoRendition,
      }));
    },
    mediaEvents: ['emptied', 'loadstart'],
    videoRenditionsEvents: ['addrendition', 'removerendition'],
  },
  /** @TODO Model this as a derived value? (CJP) */
  mediaRenditionSelected: {
    get: function (stateOwners) {
      const { media } = stateOwners;
      return media?.videoRenditions?.[media.videoRenditions?.selectedIndex]?.id;
    },
    set: function (value, stateOwners) {
      const { media } = stateOwners;
      if (!media?.videoRenditions) {
        console.warn(
          'MediaController: Rendition selection not supported by this media.'
        );
        return;
      }

      const renditionId = value;
      // NOTE: videoRenditions is an array-like, not an array (CJP)
      const index = Array.prototype.findIndex.call(
        media.videoRenditions,
        (r) => r.id == renditionId
      );

      if (media.videoRenditions.selectedIndex != index) {
        media.videoRenditions.selectedIndex = index;
      }
    },
    mediaEvents: ['emptied'],
    videoRenditionsEvents: ['addrendition', 'removerendition', 'change'],
  },
  mediaAudioTrackList: {
    get: function (stateOwners) {
      const { media } = stateOwners;
      return [...(media?.audioTracks ?? [])];
    },
    mediaEvents: ['emptied', 'loadstart'],
    audioTracksEvents: ['addtrack', 'removetrack'],
  },
  mediaAudioTrackEnabled: {
    get: function (stateOwners) {
      const { media } = stateOwners;
      return [...(media?.audioTracks ?? [])].find(
        (audioTrack) => audioTrack.enabled
      )?.id;
    },
    set: function (value, stateOwners) {
      const { media } = stateOwners;
      if (!media?.audioTracks) {
        console.warn(
          'MediaChrome: Audio track selection not supported by this media.'
        );
        return;
      }

      const audioTrackId = value;

      for (let track of media.audioTracks) {
        track.enabled = audioTrackId == track.id;
      }
    },
    mediaEvents: ['emptied'],
    audioTracksEvents: ['addtrack', 'removetrack', 'change'],
  },
  mediaIsFullscreen: {
    get: function (stateOwners, event) {
      const {
        media,
        rootNode = document,
        fullscreenElement = media,
      } = stateOwners;

      // iOS has a specialized fullscreen API on the video element.
      // https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1630493-webkitdisplayingfullscreen
      if (
        media &&
        rootNode[fullscreenApi.element] === undefined &&
        'webkitDisplayingFullscreen' in media
      ) {
        // For some reason webkitDisplayingFullscreen is true when in PiP,
        // add an extra presentation mode is fullscreen check.
        return (
          media.webkitDisplayingFullscreen &&
          media.webkitPresentationMode === 'fullscreen'
        );
      }

      let currentFullscreenEl = rootNode[fullscreenApi.element];

      if (event) {
        // Safari < 16.4 doesn't support ShadowRoot.fullscreenElement.
        // document.fullscreenElement could be several ancestors up the tree.
        // Use event.target instead.
        const isSomeElementFullscreen = document[fullscreenApi.element];
        currentFullscreenEl = isSomeElementFullscreen ? event.target : null;
      }

      return containsComposedNode(fullscreenElement, currentFullscreenEl);
    },
    set: function (value, stateOwners) {
      const { media, fullscreenElement } = stateOwners;
      if (!value) {
        // NOTE: Must be document, not whatever "rootNode" stateOwner is identified as (CJP)
        document?.[fullscreenApi.exit]?.();
        return;
      }
      if (fullscreenElement?.[fullscreenApi.enter]) {
        fullscreenElement[fullscreenApi.enter]?.();
      } else if (media.webkitEnterFullscreen) {
        // Media element fullscreen using iOS API
        media.webkitEnterFullscreen();
      } else if (media.requestFullscreen) {
        // So media els don't have to implement multiple APIs.
        media.requestFullscreen();
      }
    },
    rootEvents: fullscreenApi.rootEvents,
    // iOS requires `webkitbeginfullscreen` and `webkitendfullscreen` events on the video.
    mediaEvents: fullscreenApi.mediaEvents,
  },
  mediaIsCasting: {
    // Note this relies on a customized castable-video element.
    get: function (stateOwners) {
      const { media } = stateOwners;

      if (!media?.remote || media.remote?.state === 'disconnected')
        return false;

      return !!media.remote.state;
    },
    set: function (value, stateOwners) {
      const { media } = stateOwners;
      if (value && media.remote?.state !== 'disconnected') return;
      if (!value && media.remote?.state !== 'connected') return;

      if (typeof media.remote.prompt !== 'function') {
        console.warn(
          'MediaChrome: Casting is not supported in this environment'
        );
        return;
      }

      // Open the browser cast menu.
      // Note this relies on a customized castable-video element.
      media.remote
        .prompt()
        // Don't warn here because catch is run when the user closes the cast menu.
        .catch(() => {});
    },
    remoteEvents: ['connect', 'connecting', 'disconnect'],
  },
  // NOTE: Newly added state for tracking airplaying
  mediaIsAirplaying: {
    // NOTE: Cannot know if airplaying since Safari doesn't fully support HTMLMediaElement::remote yet (e.g. remote::state) (CJP)
    get: function () {
      return false;
    },
    set: function (_value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
      if (
        !(
          media.webkitShowPlaybackTargetPicker &&
          globalThis.WebKitPlaybackTargetAvailabilityEvent
        )
      ) {
        console.warn(
          'received a request to select AirPlay but AirPlay is not supported in this environment'
        );
        return;
      }
      media.webkitShowPlaybackTargetPicker();
    },
    mediaEvents: ['webkitcurrentplaybacktargetiswirelesschanged'],
  },
  mediaFullscreenUnavailable: {
    get: function (stateOwners) {
      const { media } = stateOwners;
      if (!fullscreenSupported || !hasFullscreenSupport(media))
        return AvailabilityStates.UNSUPPORTED;
      return undefined;
    },
  },
  mediaPipUnavailable: {
    get: function (stateOwners) {
      const { media } = stateOwners;
      if (!pipSupported || !hasPipSupport(media))
        return AvailabilityStates.UNSUPPORTED;
    },
  },
  mediaVolumeUnavailable: {
    get: function (stateOwners) {
      const { media } = stateOwners;

      if (volumeSupported === false || media?.volume == undefined) {
        return AvailabilityStates.UNSUPPORTED;
      }

      return undefined;
    },
    // NOTE: Slightly different impl here. Added generic support for
    // "stateOwnersUpdateHandlers" since the original impl had to hack around
    // race conditions. (CJP)
    stateOwnersUpdateHandlers: [
      (handler) => {
        if (volumeSupported == null) {
          volumeSupportPromise.then((supported) =>
            handler(supported ? undefined : AvailabilityStates.UNSUPPORTED)
          );
        }
      },
    ],
  },
  mediaCastUnavailable: {
    // @ts-ignore
    get: function (stateOwners, { availability = false } = {}) {
      const { media } = stateOwners;

      if (!castSupported || !media?.remote?.state) {
        return AvailabilityStates.UNSUPPORTED;
      }

      if (availability == null || availability === true) return undefined;

      return AvailabilityStates.UNAVAILABLE;
    },
    stateOwnersUpdateHandlers: [
      (handler, stateOwners) => {
        const { media } = stateOwners;
        media?.remote?.watchAvailability((availability) =>
          // @ts-ignore
          handler({ availability })
        );
        return () => {
          media?.remote?.cancelWatchAvailability();
        };
      },
    ],
  },
  mediaAirplayUnavailable: {
    get: function (_stateOwners, event) {
      if (!airplaySupported) return AvailabilityStates.UNSUPPORTED;
      // @ts-ignore
      if (event?.availability === 'not-available') {
        return AvailabilityStates.UNAVAILABLE;
      }
      // Either available via `availability` state or not yet known
      return undefined;
    },
    mediaEvents: ['webkitplaybacktargetavailabilitychanged'],
  },
  mediaRenditionUnavailable: {
    get: function (stateOwners) {
      const { media } = stateOwners;

      if (!media?.videoRenditions) {
        return AvailabilityStates.UNSUPPORTED;
      }

      if (!media.videoRenditions?.length) {
        return AvailabilityStates.UNAVAILABLE;
      }

      return undefined;
    },
    mediaEvents: ['emptied', 'loadstart'],
    videoRenditionsEvents: ['addrendition', 'removerendition'],
  },
  mediaAudioTrackUnavailable: {
    get: function (stateOwners) {
      const { media } = stateOwners;

      if (!media?.audioTracks) {
        return AvailabilityStates.UNSUPPORTED;
      }

      // An audio selection is only possible if there are 2 or more audio tracks.
      if ((media.audioTracks?.length ?? 0) <= 1) {
        return AvailabilityStates.UNAVAILABLE;
      }

      return undefined;
    },
    mediaEvents: ['emptied', 'loadstart'],
    audioTracksEvents: ['addtrack', 'removetrack'],
  },
};

// Allow us to default/initialize our relevant state owners
/**
 *
 * @param {{
 *   media?: MediaStateOwner;
 *   fullscreenElement?: FullScreenElementStateOwner;
 *   rootNode?: RootNodeStateOwner;
 *   stateFacade?: StateFacade;
 *   options?: MediaStoreOptions;
 *   monitorStateOwnersOnlyWithSubscriptions?: boolean;
 * }} mediaStoreConfig
 * @returns {MediaStore}
 */
const createMediaStore = ({
  media,
  fullscreenElement,
  rootNode = document,
  stateFacade = defaultStateFacade,
  options = {},
  monitorStateOwnersOnlyWithSubscriptions = false,
}) => {
  const callbacks = [];

  // We may eventually want to expose the state owners as part of the state
  // or as a specialized getter API for advanced use cases
  /** @type {StateOwners} */
  const stateOwners = {
    // Spreading options here since folks should not rely on holding onto references
    // for any app-level logic wrt options.
    options: { ...options },
  };

  /** @TODO How to model initial state for values not (currently) provided via the facade? (CJP) */
  /**
   * @type {Partial<MediaState>}
   */
  let state = Object.freeze({
    mediaPreviewTime: undefined,
    mediaPreviewImage: undefined,
    mediaPreviewCoords: undefined,
  });

  const updateState = (nextStateDelta) => {
    if (areValuesEq(nextStateDelta, state)) {
      return;
    }

    // Update the state since it changed.
    // Using an "immutable" approach here so
    // callbacks can easily do comparisons between prev/next state.
    // Freezing isn't necessary, though it's a light touch enforcement
    // of immutability (in case folks try to directly modify state)
    state = Object.freeze({
      ...state,
      ...nextStateDelta,
    });

    // Given anything that cares the updated state
    callbacks.forEach((cb) => cb(state));
  };

  const updateStateFromFacade = (transientStateOwners) => {
    const nextState = Object.entries(stateFacade).reduce(
      (nextState, [stateName, { get }]) => {
        // (re)initialize state based on current derived state of facade
        // NOTE: Since we don't know what stateOwners are tied to deriving a particular state,
        // we should update this if *any*  state owner changed. (CJP)
        nextState[stateName] = get({ ...stateOwners, ...transientStateOwners });
        return nextState;
      },
      {}
    );

    // since a bunch of state likely changed, update with the latest computed values
    updateState(nextState);
  };

  // Dictionary for event handler storage and cleanup
  const stateUpdateHandlers = {};
  // This function will handle all wiring up of event handlers/monitoring of state
  // and will re-compute the general next state whenever any "state owner" is set or updated,
  // which includes the media element, but also the rootNode and the fullscreenElement
  // This is roughly equivalent to what used to be in `mediaSetCallback`/`mediaUnsetCallback` (CJP)
  const updateStateOwners = (nextStateOwnersDelta) => {
    // Nothing actually changed, so bail early.
    if (
      Object.entries(nextStateOwnersDelta).every(
        ([stateOwnerName, stateOwnerValue]) =>
          stateOwners[stateOwnerName] === stateOwnerValue
      )
    ) {
      return;
    }

    const {
      media: prevMedia,
      // No events currently tied to fullscreenElement
      // fullscreenElement: prevFullscreenElement,
      rootNode: prevRootNode,
    } = stateOwners;

    // Since something changed, we can update the stateOwners now so it may be used
    // for state derivation below.
    Object.entries(nextStateOwnersDelta).forEach(
      ([stateOwnerName, stateOwnerValue]) => {
        stateOwners[stateOwnerName] = stateOwnerValue;
      }
    );

    Object.entries(stateFacade).forEach(
      ([
        stateName,
        {
          get,
          mediaEvents = [],
          textTracksEvents = [],
          videoRenditionsEvents = [],
          audioTracksEvents = [],
          remoteEvents = [],
          rootEvents = [],
          stateOwnersUpdateHandlers = [],
        },
      ]) => {
        // NOTE: This should probably be pulled out into a one-time initialization (CJP)
        if (!stateUpdateHandlers[stateName]) {
          stateUpdateHandlers[stateName] = {};
        }

        const handler = (event) => {
          const nextValue = get(stateOwners, event);
          updateState({ [stateName]: nextValue });
        };

        let prevHandler;
        // Media Changed, update handlers here
        if (prevMedia !== stateOwners.media) {
          prevHandler = stateUpdateHandlers[stateName].mediaEvents;
          mediaEvents.forEach((eventType) => {
            if (prevHandler && prevMedia) {
              prevMedia.removeEventListener(eventType, prevHandler);
              stateUpdateHandlers[stateName].mediaEvents = undefined;
            }
            if (stateOwners.media) {
              stateOwners.media.addEventListener(eventType, handler);
              stateUpdateHandlers[stateName].mediaEvents = handler;
            }
          });
          prevHandler = stateUpdateHandlers[stateName].textTracksEvents;
          textTracksEvents.forEach((eventType) => {
            if (prevHandler && prevMedia?.textTracks) {
              prevMedia.textTracks.removeEventListener(eventType, prevHandler);
              stateUpdateHandlers[stateName].textTracksEvents = undefined;
            }
            if (stateOwners.media?.textTracks) {
              stateOwners.media.textTracks.addEventListener(eventType, handler);
              stateUpdateHandlers[stateName].textTracksEvents = handler;
            }
          });
          prevHandler = stateUpdateHandlers[stateName].videoRenditionsEvents;
          videoRenditionsEvents.forEach((eventType) => {
            if (prevHandler && prevMedia?.videoRenditions) {
              prevMedia.videoRenditions.removeEventListener(
                eventType,
                prevHandler
              );
              stateUpdateHandlers[stateName].videoRenditionsEvents = undefined;
            }
            if (stateOwners.media?.videoRenditions) {
              stateOwners.media.videoRenditions.addEventListener(
                eventType,
                handler
              );
              stateUpdateHandlers[stateName].videoRenditionsEvents = handler;
            }
          });
          prevHandler = stateUpdateHandlers[stateName].audioTracksEvents;
          audioTracksEvents.forEach((eventType) => {
            if (prevHandler && prevMedia?.audioTracks) {
              prevMedia.audioTracks.removeEventListener(eventType, prevHandler);
              stateUpdateHandlers[stateName].audioTracksEvents = undefined;
            }
            if (stateOwners.media?.audioTracks) {
              stateOwners.media.audioTracks.addEventListener(
                eventType,
                handler
              );
              stateUpdateHandlers[stateName].audioTracksEvents = handler;
            }
          });
          prevHandler = stateUpdateHandlers[stateName].remoteEvents;
          remoteEvents.forEach((eventType) => {
            if (prevHandler && prevMedia?.remote) {
              prevMedia.remote.removeEventListener(eventType, prevHandler);
              stateUpdateHandlers[stateName].remoteEvents = undefined;
            }
            if (stateOwners.media?.remote) {
              stateOwners.media.remote.addEventListener(eventType, handler);
              stateUpdateHandlers[stateName].remoteEvents = handler;
            }
          });
        }

        if (prevRootNode !== stateOwners.rootNode) {
          prevHandler = stateUpdateHandlers[stateName].rootEvents;
          rootEvents.forEach((eventType) => {
            if (prevHandler && prevRootNode) {
              prevRootNode.removeEventListener(eventType, prevHandler);
              stateUpdateHandlers[stateName].rootEvents = undefined;
            }
            if (stateOwners.rootNode) {
              stateOwners.rootNode.addEventListener(eventType, handler);
              stateUpdateHandlers[stateName].rootEvents = handler;
            }
          });
        }

        // NOTE: Since custom update handlers may depend on *any* state owner
        // we should apply them whenever any state owner changes (CJP)
        const prevHandlerTeardown =
          stateUpdateHandlers[stateName].stateOwnersUpdateHandlers;
        stateOwnersUpdateHandlers.forEach((fn) => {
          if (prevHandlerTeardown) {
            prevHandlerTeardown();
          }
          stateUpdateHandlers[stateName].stateOwnersUpdateHandlers = fn(
            handler,
            stateOwners
          );
        });
      }
    );

    updateStateFromFacade();
  };

  if (!monitorStateOwnersOnlyWithSubscriptions) {
    updateStateOwners({ media, fullscreenElement, rootNode, options });
  } else {
    // NOTE: Even if we're not monitoring, we should still update the state from the facade + state owners (CJP)
    // updateStateFromFacade({ media, fullscreenElement, rootNode });
    // stateOwners.media = media;
    // stateOwners.fullscreenElement = fullscreenElement;
    // stateOwners.rootNode = rootNode;
    updateStateFromFacade();
  }

  return {
    // note that none of these cases directly interact with the media element, root node, full screen element, etc.
    // note these "actions" could just be the events if we wanted, especially if we normalize on "detail" for
    // any payload-relevant values
    // This is roughly equivalent to our used to be in our state requests dictionary object, though much of the
    // "heavy lifting" is now moved into the facade `set()`
    dispatch({ type, detail }) {
      // NOTE: These could also be switch statements (also common in e.g. redux "reducers" and similar state architectures) (CJP)
      /**
       * @TODO Consider adding state for e.g. `mediaThumbnailCues` and use that for derived state here (CJP)
       */
      if (type === MediaUIEvents.MEDIA_PREVIEW_REQUEST) {
        const { media } = stateOwners;

        const mediaPreviewTime = detail ?? undefined;
        let mediaPreviewImage = undefined;
        let mediaPreviewCoords = undefined;

        // preview-related state should be reset to nothing
        // when there is no media or the preview time request is null/undefined
        if (media && mediaPreviewTime != null) {
          // preview thumbnail image-related derivation
          const [track] = getTextTracksList(media, {
            kind: TextTrackKinds.METADATA,
            label: 'thumbnails',
          });
          const cue = Array.prototype.find.call(
            track?.cues ?? [],
            (cue) => cue.startTime >= mediaPreviewTime
          );
          if (cue) {
            const base = !/'^(?:[a-z]+:)?\/\//i.test(cue.text)
              ? /** @type {HTMLTrackElement | null} */ (
                  media?.querySelector('track[label="thumbnails"]')
                )?.src
              : undefined;
            const url = new URL(cue.text, base);
            const previewCoordsStr = new URLSearchParams(url.hash).get('#xywh');
            mediaPreviewCoords = previewCoordsStr.split(',');
            mediaPreviewImage = url.href;
          }
        }

        updateState({
          mediaPreviewTime,
          mediaPreviewImage,
          mediaPreviewCoords,
        });
      } else if (
        [
          MediaUIEvents.MEDIA_PAUSE_REQUEST,
          MediaUIEvents.MEDIA_PLAY_REQUEST,
        ].includes(type)
      ) {
        const key = 'mediaPaused';
        const value = type === MediaUIEvents.MEDIA_PAUSE_REQUEST;

        /** @TODO Only do this for non-dvr live (CJP) */
        if (!value && state.mediaStreamType === StreamTypes.LIVE) {
          const liveEdgeTime = state.mediaSeekable?.[1];
          // Only seek to live if we are live and have a known seekable end
          if (liveEdgeTime) {
            stateFacade.mediaCurrentTime.set(liveEdgeTime, stateOwners);
          }
        }

        stateFacade[key].set(value, stateOwners);
      } else if (type === MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST) {
        const key = 'mediaPlaybackRate';
        const value = detail;
        stateFacade[key].set(value, stateOwners);
      } else if (
        [
          MediaUIEvents.MEDIA_MUTE_REQUEST,
          MediaUIEvents.MEDIA_UNMUTE_REQUEST,
        ].includes(type)
      ) {
        const key = 'mediaMuted';
        const value = type === MediaUIEvents.MEDIA_MUTE_REQUEST;
        // If we've unmuted but our volume is currently 0, automatically set it to some low volume
        if (!value && !state.mediaVolume) {
          stateFacade.mediaVolume.set(0.25, stateOwners);
        }
        stateFacade[key].set(value, stateOwners);
      } else if (type === MediaUIEvents.MEDIA_VOLUME_REQUEST) {
        const key = 'mediaVolume';
        const value = detail;
        // If we've adjusted the volume to some non-0 number and are muted, automatically unmute.
        // NOTE: "pseudo-muted" is currently modeled via MEDIA_VOLUME_LEVEL === "off" (CJP)
        if (value && state.mediaMuted) {
          stateFacade.mediaMuted.set(false, stateOwners);
        }
        stateFacade[key].set(value, stateOwners);
      } else if (type === MediaUIEvents.MEDIA_SEEK_REQUEST) {
        const key = 'mediaCurrentTime';
        const value = detail;
        stateFacade[key].set(value, stateOwners);
      } else if (type === MediaUIEvents.MEDIA_SEEK_TO_LIVE_REQUEST) {
        // This is an example of a specialized state change request "action" that doesn't need a specialized
        // state facade model
        const key = 'mediaCurrentTime';
        const value = state.mediaSeekable?.[1];
        // If we don't have a known seekable end (which represents the live edge), bail early
        if (!Number.isNaN(Number(value))) return;
        stateFacade[key].set(value, stateOwners);
      }
      // Text Tracks state change requests
      else if (type === MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST) {
        const tracks = getSubtitleTracks(stateOwners);
        const tracksToUpdate = parseTracks(detail);
        const preferredLanguage = tracksToUpdate[0]?.language;
        if (preferredLanguage && !options.noSubtitlesLangPref) {
          globalThis.localStorage.setItem(
            'media-chrome-pref-subtitles-lang',
            preferredLanguage
          );
        }
        updateTracksModeTo(TextTrackModes.SHOWING, tracks, tracksToUpdate);
      } else if (type === MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST) {
        const tracks = getSubtitleTracks(stateOwners);
        const tracksToUpdate = detail ?? [];
        updateTracksModeTo(TextTrackModes.DISABLED, tracks, tracksToUpdate);
      } else if (type === MediaUIEvents.MEDIA_TOGGLE_SUBTITLES_REQUEST) {
        toggleSubtitleTracks(stateOwners, detail);
      }
      // Renditions state change requests
      else if (type === MediaUIEvents.MEDIA_RENDITION_REQUEST) {
        const key = 'mediaRenditionSelected';
        const value = detail;
        stateFacade[key].set(value, stateOwners);
      } else if (type === MediaUIEvents.MEDIA_AUDIO_TRACK_REQUEST) {
        const key = 'mediaAudioTrackEnabled';
        const value = detail;
        stateFacade[key].set(value, stateOwners);
      }
      // State change requests dependent on root node
      else if (
        [
          MediaUIEvents.MEDIA_ENTER_PIP_REQUEST,
          MediaUIEvents.MEDIA_EXIT_PIP_REQUEST,
        ].includes(type)
      ) {
        const key = 'mediaIsPip';
        const value = type === MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
        if (value) {
          // Exit fullscreen if in fullscreen and entering PiP
          if (state.mediaIsFullscreen) {
            // Should be async
            stateFacade.mediaIsFullscreen.set(false, stateOwners);
          }
        }
        stateFacade[key].set(value, stateOwners);
      } else if (
        [
          MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST,
          MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST,
        ].includes(type)
      ) {
        const key = 'mediaIsFullscreen';
        const value = type === MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
        if (value) {
          // Exit PiP if in PiP and entering fullscreen
          if (state.mediaIsPip) {
            // Should be async
            stateFacade.mediaIsPip.set(false, stateOwners);
          }
        }
        stateFacade[key].set(value, stateOwners);
      } else if (
        [
          MediaUIEvents.MEDIA_ENTER_CAST_REQUEST,
          MediaUIEvents.MEDIA_EXIT_CAST_REQUEST,
        ].includes(type)
      ) {
        const key = 'mediaIsCasting';
        const value = type === MediaUIEvents.MEDIA_ENTER_CAST_REQUEST;
        if (value) {
          // Exit fullscreen if in fullscreen and attempting to cast
          if (state.mediaIsFullscreen) {
            // Should be async
            stateFacade.mediaIsFullscreen.set(false, stateOwners);
          }
        }
        stateFacade[key].set(value, stateOwners);
      } else if (type === MediaUIEvents.MEDIA_AIRPLAY_REQUEST) {
        const key = 'mediaIsAirplaying';
        stateFacade[key].set(true, stateOwners);
      }
      // These are new concepts so we can dynamically update
      // things like the media element, fullscreenElement,
      // or options-style properties in a single architecture
      // (before these fed into things like props, methods, and attributeChangedCallback)
      // we can also e.g. get updates for the stateOwners themselves
      else if (type === 'mediaelementchangerequest') {
        updateStateOwners({ media: detail });
      } else if (type === 'fullscreenelementchangerequest') {
        updateStateOwners({ fullscreenElement: detail });
      } else if (type === 'rootnodechangerequest') {
        updateStateOwners({ rootNode: detail });
      }
      // and we can update our default/options values
      else if (type === 'optionschangerequest') {
        // Doing a simple impl for now
        Object.entries(detail ?? {}).forEach(([optionName, optionValue]) => {
          // NOTE: updating options will *NOT* prompt any state updates.
          // However, since we directly mutate options, this allows state owners to be
          // "live" and automatically updated for any other event or similar monitoring.
          // For a concrete example, see, e.g., the `mediaSubtitlesShowing.stateOwnersUpdateHandlers`
          // responsible for managing/monitoring `defaultSubtitles` in the `defaultStateFacade`. (CJP)
          stateOwners.options[optionName] = optionValue;
        });
      }
    },
    getState() {
      // return the current state, whatever it is
      return state;
    },
    subscribe(callback) {
      if (!callbacks.length && monitorStateOwnersOnlyWithSubscriptions) {
        // When configured to monitor if and only if there's 1+ subscriptions, we need to force
        // a "change" in our state owners to cause event handlers to get added. This code
        // ensures that. (CJP)
        const stateOwnersToKeep = { ...stateOwners };
        stateOwners.media = undefined;
        stateOwners.fullscreenElement = undefined;
        stateOwners.rootNode = undefined;
        updateStateOwners(stateOwnersToKeep);
      }
      callbacks.push(callback);
      // give the callback the current state immediately so it can get whatever the state is currently.
      callback(state);
      return () => {
        callbacks.splice(callbacks.indexOf(callback), 1);
        if (!callbacks.length && monitorStateOwnersOnlyWithSubscriptions) {
          // When configured to monitor if and only if there's 1+ subscriptions, we need to force
          // a "change" in our state owners to cause event handlers to get removed. This code
          // ensures that. (CJP)
          const stateOwnersToKeep = { ...stateOwners };
          updateStateOwners({
            media: undefined,
            fullscreenElement: undefined,
            rootNode: undefined,
          });
          stateOwners.media = stateOwnersToKeep.media;
          stateOwners.fullscreenElement = stateOwnersToKeep.fullscreenElement;
          stateOwners.rootNode = stateOwnersToKeep.rootNode;
        }
      };
    },
  };
};

export default createMediaStore;
