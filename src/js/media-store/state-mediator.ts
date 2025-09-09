import { document, globalThis } from '../utils/server-safe-globals.js';
import {
  AvailabilityStates,
  StreamTypes,
  TextTrackKinds,
} from '../constants.js';
import { containsComposedNode } from '../utils/element-utils.js';
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
} from '../utils/fullscreen-api.js';
import {
  airplaySupported,
  castSupported,
  fullscreenSupported,
  hasFullscreenSupport,
  hasPipSupport,
  hasVolumeSupportAsync,
  pipSupported,
} from '../utils/platform-tests.js';
import {
  getShowingSubtitleTracks,
  getSubtitleTracks,
  toggleSubtitleTracks,
} from './util.js';
import { getTextTracksList } from '../utils/captions.js';
import { isValidNumber } from '../utils/utils.js';

export type Rendition = {
  src?: string;
  id?: string;
  width?: number;
  height?: number;
  bitrate?: number;
  frameRate?: number;
  codec?: string;
  readonly selected?: boolean;
};

export type AudioTrack = {
  id?: string;
  kind?: string;
  label: string;
  language: string;
  enabled: boolean;
};

/**
 *
 * MediaStateOwner is in a sense both a subset and a superset of `HTMLVideoElement` and is used as the primary
 * "source of truth" for media state, as well as the primary target for state change requests.
 *
 * It is a subset insofar as only the `play()` method, the `paused` property, and the `addEventListener()`/`removeEventListener()` methods
 * are *required* and required to conform to their definition of `HTMLMediaElement` on the entity used. All other interfaces
 * (properties, methods, events, etc.) are optional, but, when present, *must* conform to `HTMLMediaElement`/`HTMLVideoElement`
 * to avoid unexpected state behavior. This includes, for example, ensuring state updates occur *before* related events are fired
 * that are used to monitor for potential state changes.
 *
 * It is a superset insofar as it supports an extended interface for media state that may be browser-specific (e.g. `webkit`-prefixed
 * properties/methods) or are not immediately derivable from primary media state or other state owners. These include things like
 * `videoRenditions` for e.g. HTTP Adaptive Streaming media (such as HLS or MPEG-DASH), `audioTracks`, or `streamType`, which identifies
 * whether the media ("stream") is "live" or "on demand". Several of these are specified and formalized on https://github.com/video-dev/media-ui-extensions.
 */
export type MediaStateOwner = Partial<HTMLVideoElement> &
  Pick<
    HTMLMediaElement,
    'play' | 'paused' | 'addEventListener' | 'removeEventListener'
  > & {
    streamType?: StreamTypes;
    targetLiveWindow?: number;
    liveEdgeStart?: number;
    videoRenditions?: Rendition[] & EventTarget & { selectedIndex?: number };
    audioTracks?: AudioTrack[] & EventTarget;
    requestCast?: () => any;
    webkitDisplayingFullscreen?: boolean;
    webkitPresentationMode?: 'fullscreen' | 'picture-in-picture';
    webkitEnterFullscreen?: () => any;
    webkitCurrentPlaybackTargetIsWireless?: boolean;
    webkitShowPlaybackTargetPicker?: () => any;
  };

export type RootNodeStateOwner = Partial<Document | ShadowRoot>;

export type FullScreenElementStateOwner = Partial<HTMLElement> & EventTarget;

export type StateOption = {
  defaultSubtitles?: boolean;
  defaultStreamType?: StreamTypes;
  defaultDuration?: number;
  liveEdgeOffset?: number;
  seekToLiveOffset?: number;
  noAutoSeekToLive?: boolean;
  noVolumePref?: boolean;
  noMutedPref?: boolean;
  noSubtitlesLangPref?: boolean;
  mediaLang?: string;
};

/**
 *
 * StateOwners are anything considered a source of truth or a target for updates for state. The media element (or "element") is a source of truth for the state of media playback,
 * but other things could also be a source of truth for information about the media. These include:
 *
 * - media - the media element
 * - fullscreenElement - the element that will be used when in full screen (e.g. for Media Chrome, this will typically be the MediaController)
 * - documentElement - top level node for DOM context (usually document and defaults to `document` in `createMediaStore()`)
 * - options - state behavior/user preferences (e.g. defaultSubtitles to enable subtitles by default as the relevant state or state owners change)
 */
export type StateOwners = {
  media?: MediaStateOwner;
  documentElement?: RootNodeStateOwner;
  fullscreenElement?: FullScreenElementStateOwner;
  options?: StateOption;
};

export type EventOrAction<D = undefined> = {
  type: string;
  detail?: D;
  target?: EventTarget;
};

export type FacadeGetter<T, D = T> = (
  stateOwners: StateOwners,
  event?: EventOrAction<D>
) => T;

export type FacadeSetter<T> = (value: T, stateOwners: StateOwners) => void;

export type StateOwnerUpdateHandler<T> = (
  handler: (value: T) => void,
  stateOwners: StateOwners
) => void;

export type ReadonlyFacadeProp<T, D = T> = {
  get: FacadeGetter<T, D>;
  mediaEvents?: string[];
  textTracksEvents?: string[];
  videoRenditionsEvents?: string[];
  audioTracksEvents?: string[];
  remoteEvents?: string[];
  rootEvents?: string[];
  stateOwnersUpdateHandlers?: StateOwnerUpdateHandler<T>[];
};

export type FacadeProp<T, S = T, D = T> = ReadonlyFacadeProp<T, D> & {
  set: FacadeSetter<S>;
};

/**
 *
 * StateMediator provides a stateless, well-defined API for getting and setting/updating media-relevant state on a set of (stateful) StateOwners.
 * In addition, it identifies monitoring conditions for potential state changes for any given bit of state. StateMediator is designed to be used
 * by a MediaStore, which owns all of the wiring up and persistence of e.g. StateOwners, MediaState, and the StateMediator.
 *
 * For any modeled state, the StateMediator defines a key, K, which names the state (e.g. `mediaPaused`, `mediaSubtitlesShowing`, `mediaCastUnavailable`,
 * etc.), whose value defines the aforementioned using:
 *
 * - `get(stateOwners, event)` - Retrieves the current state of K from StateOwners, potentially using the (optional) event to help identify the state.
 * - `set(value, stateOwners)` (Optional, not available for `Readonly` state) - Interact with StateOwners via their interfaces to (directly or indirectly) update the state of K, using the value to determine the intended state change side effects.
 * - `mediaEvents[]` (Optional) - An array of event types to monitor on `stateOwners.media` for potential changes in the state of K.
 * - `textTracksEvents[]` (Optional) - An array of event types to monitor on `stateOwners.media.textTracks` for potential changes in the state of K.
 * - `videoRenditionsEvents[]` (Optional) - An array of event types to monitor on `stateOwners.media.videoRenditions` for potential changes in the state of K.
 * - `audioTracksEvents[]` (Optional) - An array of event types to monitor on `stateOwners.media.audioTracks` for potential changes in the state of K.
 * - `remoteEvents[]` (Optional) - An array of event types to monitor on `stateOwners.media.remote` for potential changes in the state of K.
 * - `rootEvents[]` (Optional) - An array of event types to monitor on `stateOwners.documentElement` for potential changes in the state of K.
 * - `stateOwnersUpdateHandlers[]` (Optional) - An array of functions that define arbitrary code for monitoring or causing state changes, optionally returning a "teardown" function for cleanup.
 *
 * @example &lt;caption>Basic Example (NOTE: This is for informative use only. StateMediator is not intended to be used directly).&lt;/caption>
 *
 * // Simple stateOwners example
 * const stateOwners = {
 *   media: myVideoElement,
 *   fullscreenElement: myMediaUIContainerElement,
 *   documentElement: document,
 * };
 *
 * // Current mediaPaused state
 * let mediaPaused = stateMediator.mediaPaused.get(stateOwners);
 *
 * // Event handler to update mediaPaused to its latest state;
 * const updateMediaPausedEventHandler = (event) => {
 *   mediaPaused = stateMediator.mediaPaused.get(stateOwners, event);
 * };
 *
 * // Monitor for potential changes to mediaPaused state.
 * stateMediator.mediaPaused.mediaEvents.forEach(eventType => {
 *   stateOwners.media.addEventListener(eventType, updateMediaPausedEventHandler);
 * });
 *
 * // Function to toggle between mediaPaused and !mediaPaused (media "unpaused", or "playing" under normal conditions)
 * const toggleMediaPaused = () => {
 *   const nextMediaPaused = !mediaPaused;
 *   stateMediator.mediaPaused.set(nextMediaPaused, stateOwners);
 * };
 *
 *
 * // ... Eventual teardown, when relevant. This is especially relevant for potential garbage collection/memory management considerations.
 * stateMediator.mediaPaused.mediaEvents.forEach(eventType => {
 *   stateOwners.media.removeEventListener(eventType, updateMediaPausedEventHandler);
 * });
 *
 */
export type StateMediator = {
  mediaErrorCode: ReadonlyFacadeProp<MediaError['code']>;
  mediaErrorMessage: ReadonlyFacadeProp<MediaError['message']>;
  mediaError: ReadonlyFacadeProp<MediaError>;
  mediaWidth: ReadonlyFacadeProp<number>;
  mediaHeight: ReadonlyFacadeProp<number>;
  mediaPaused: FacadeProp<HTMLMediaElement['paused']>;
  mediaHasPlayed: ReadonlyFacadeProp<boolean>;
  mediaEnded: ReadonlyFacadeProp<HTMLMediaElement['ended']>;
  mediaPlaybackRate: FacadeProp<HTMLMediaElement['playbackRate']>;
  mediaMuted: FacadeProp<HTMLMediaElement['muted']>;
  mediaVolume: FacadeProp<HTMLMediaElement['volume']>;
  mediaVolumeLevel: ReadonlyFacadeProp<'high' | 'medium' | 'low' | 'off'>;
  mediaCurrentTime: FacadeProp<HTMLMediaElement['currentTime']>;
  mediaDuration: ReadonlyFacadeProp<HTMLMediaElement['duration']>;
  mediaLoading: ReadonlyFacadeProp<boolean>;
  mediaSeekable: ReadonlyFacadeProp<[number, number] | undefined>;
  mediaBuffered: ReadonlyFacadeProp<[number, number][]>;
  mediaStreamType: ReadonlyFacadeProp<StreamTypes>;
  mediaTargetLiveWindow: ReadonlyFacadeProp<number>;
  mediaTimeIsLive: ReadonlyFacadeProp<boolean>;
  mediaSubtitlesList: ReadonlyFacadeProp<
    Pick<TextTrack, 'kind' | 'label' | 'language'>[]
  >;
  mediaSubtitlesShowing: ReadonlyFacadeProp<
    Pick<TextTrack, 'kind' | 'label' | 'language'>[]
  >;
  mediaChaptersCues: ReadonlyFacadeProp<
    Pick<VTTCue, 'text' | 'startTime' | 'endTime'>[]
  >;
  mediaIsPip: FacadeProp<boolean>;
  mediaRenditionList: ReadonlyFacadeProp<Rendition[]>;
  mediaRenditionSelected: FacadeProp<string, string>;
  mediaAudioTrackList: ReadonlyFacadeProp<{ id?: string }[]>;
  mediaAudioTrackEnabled: FacadeProp<string, string>;
  mediaIsFullscreen: FacadeProp<boolean>;
  mediaIsCasting: FacadeProp<
    boolean,
    boolean,
    'NO_DEVICES_AVAILABLE' | 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED'
  >;
  mediaIsAirplaying: FacadeProp<boolean>;
  mediaLang: ReadonlyFacadeProp<string | undefined>;
  mediaFullscreenUnavailable: ReadonlyFacadeProp<
    AvailabilityStates | undefined
  >;
  mediaPipUnavailable: ReadonlyFacadeProp<AvailabilityStates | undefined>;
  mediaVolumeUnavailable: ReadonlyFacadeProp<AvailabilityStates | undefined>;
  mediaCastUnavailable: ReadonlyFacadeProp<AvailabilityStates | undefined>;
  mediaAirplayUnavailable: ReadonlyFacadeProp<AvailabilityStates | undefined>;
  mediaRenditionUnavailable: ReadonlyFacadeProp<AvailabilityStates | undefined>;
  mediaAudioTrackUnavailable: ReadonlyFacadeProp<
    AvailabilityStates | undefined
  >;
};

const StreamTypeValues = Object.values(StreamTypes);

let volumeSupported: boolean;

export const volumeSupportPromise: Promise<boolean> =
  hasVolumeSupportAsync().then((supported) => {
    volumeSupported = supported;
    return volumeSupported;
  });

export const prepareStateOwners = async (
  /** @type {(StateOwners[keyof StateOwners])[]} */ ...stateOwners
) => {
  await Promise.all(
    stateOwners
      .filter((x) => x)
      .map(async (stateOwner) => {
        if (
          !(
            'localName' in stateOwner &&
            stateOwner instanceof globalThis.HTMLElement
          )
        ) {
          return;
        }

        const name = stateOwner.localName;
        if (!name.includes('-')) return;

        const classDef = globalThis.customElements.get(name);
        if (classDef && stateOwner instanceof classDef) return;

        await globalThis.customElements.whenDefined(name);
        globalThis.customElements.upgrade(stateOwner);
      })
  );
};

const domParser = new globalThis.DOMParser();
const parseHtmlToText = (text: string) => text ? domParser.parseFromString(text, 'text/html').body.textContent || text : text;

export const stateMediator: StateMediator = {
  mediaError: {
    get(stateOwners, event) {
      const { media } = stateOwners;
      if (event?.type === 'playing') return;
      // Add additional error info via the `mediaError` element property only.
      // This can be used in the MediaErrorDialog.formatErrorMessage() method.
      return media?.error;
    },
    mediaEvents: ['emptied', 'error', 'playing'],
  },
  mediaErrorCode: {
    get(stateOwners, event) {
      const { media } = stateOwners;
      if (event?.type === 'playing') return;
      return media?.error?.code;
    },
    mediaEvents: ['emptied', 'error', 'playing'],
  },
  mediaErrorMessage: {
    get(stateOwners, event) {
      const { media } = stateOwners;
      if (event?.type === 'playing') return;
      return media?.error?.message ?? '';
    },
    mediaEvents: ['emptied', 'error', 'playing'],
  },
  mediaWidth: {
    get(stateOwners) {
      const { media } = stateOwners;
      return media?.videoWidth ?? 0;
    },
    mediaEvents: ['resize'],
  },
  mediaHeight: {
    get(stateOwners) {
      const { media } = stateOwners;
      return media?.videoHeight ?? 0;
    },
    mediaEvents: ['resize'],
  },
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
        // Not all custom media elements return a promise from `play()`.
        media.play()?.catch(() => {});
      }
    },
    mediaEvents: ['play', 'playing', 'pause', 'emptied'],
  },
  mediaHasPlayed: {
    // We want to let the user know that the media started playing at any point (`media-has-played`).
    // Since these propagators are all called when boostrapping state, let's verify this is
    // a real playing event by checking that 1) there's media and 2) it isn't currently paused.
    get(stateOwners, event) {
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
      if (!Number.isFinite(+value)) return;
      media.playbackRate = +value;
    },
    mediaEvents: ['ratechange', 'loadstart'],
  },
  mediaMuted: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.muted ?? false;
    },
    set(value, stateOwners) {
      const { media, options: { noMutedPref } = {} } = stateOwners;
      if (!media) return;

      // Prevent storing muted preference if 'muted' or noMutedPref are present
      if(!media.hasAttribute("muted") && !noMutedPref) {
        try {
          globalThis.localStorage.setItem(
            'media-chrome-pref-muted',
            value ? 'true' : 'false'
          );
        } catch (e) {
          console.debug('Error setting muted pref', e);
        }
      }

      media.muted = value;
    },
    mediaEvents: ['volumechange'],
    stateOwnersUpdateHandlers: [
      (handler, stateOwners) => {
        const {
          options: { noMutedPref },
        } = stateOwners;
        const { media } = stateOwners;
        // The muted enabled attribute should still override the preference.
        if (!media || media.muted || noMutedPref) return;
        try {
          const mutedPref =
            globalThis.localStorage.getItem('media-chrome-pref-muted') ===
            'true';

          stateMediator.mediaMuted.set(mutedPref, stateOwners);
          handler(mutedPref);
        } catch (e) {
          console.debug('Error getting muted pref', e);
        }
      },
    ],
  },
  mediaVolume: {
    get(stateOwners) {
      const { media } = stateOwners;

      return media?.volume ?? 1.0;
    },
    set(value, stateOwners) {
      const { media, options: { noVolumePref } = {} } = stateOwners;
      if (!media) return;
      // Store the last set volume as a local preference, if ls is supported
      /** @TODO How should we handle globalThis dependencies/"state ownership"? (CJP) */
      try {
        if (value == null) {
          globalThis.localStorage.removeItem('media-chrome-pref-volume');
        } else if (!media.hasAttribute('muted') && !noVolumePref) {
          // Prevent storing volume preference if 'muted' or noVolumePref are present
          globalThis.localStorage.setItem(
            'media-chrome-pref-volume',
            value.toString()
          );
        }
      } catch (e) {
        console.debug('Error setting volume pref', e);
      }
      if (!Number.isFinite(+value)) return;
      media.volume = +value;
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
          const { media } = stateOwners;
          if (!media) return;

          const volumePref = globalThis.localStorage.getItem(
            'media-chrome-pref-volume'
          );

          if (volumePref == null) return;
          stateMediator.mediaVolume.set(+volumePref, stateOwners);
          handler(+volumePref);
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
      if (!media || !isValidNumber(value)) return;
      media.currentTime = value;
    },
    mediaEvents: ['timeupdate', 'loadedmetadata'],
  },
  mediaDuration: {
    get(stateOwners) {
      const { media, options: { defaultDuration } = {} } = stateOwners;

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
    mediaEvents: ['loadedmetadata', 'emptied', 'progress', 'seekablechange'],
  },
  mediaBuffered: {
    get(stateOwners) {
      const { media } = stateOwners;

      const timeRanges: any = media?.buffered ?? [];
      return Array.from(timeRanges).map((_, i) => [
        Number(timeRanges.start(i).toFixed(3)),
        Number(timeRanges.end(i).toFixed(3)),
      ]);
    },
    mediaEvents: ['progress', 'emptied'],
  },
  mediaStreamType: {
    get(stateOwners) {
      const { media, options: { defaultStreamType } = {} } = stateOwners;

      const usedDefaultStreamType = [
        StreamTypes.LIVE,
        StreamTypes.ON_DEMAND,
      ].includes(defaultStreamType as any)
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
    get(stateOwners) {
      const { media } = stateOwners;

      if (!media) return Number.NaN;
      const { targetLiveWindow } = media;
      const streamType = stateMediator.mediaStreamType.get(stateOwners);

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
    get(stateOwners) {
      const {
        media,
        // Default to 10 seconds
        options: { liveEdgeOffset = 10 } = {},
      } = stateOwners;

      if (!media) return false;

      if (typeof media.liveEdgeStart === 'number') {
        if (Number.isNaN(media.liveEdgeStart)) return false;
        return media.currentTime >= media.liveEdgeStart;
      }

      const live =
        stateMediator.mediaStreamType.get(stateOwners) === StreamTypes.LIVE;
      // Can't be playing live if it's not a live stream
      if (!live) return false;

      // Should this use `stateMediator.mediaSeekable.get(stateOwners)?.[1]` for separation
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
    get(stateOwners) {
      return getShowingSubtitleTracks(stateOwners).map(
        ({ kind, label, language }) => ({ kind, label, language })
      );
    },
    mediaEvents: ['loadstart'],
    textTracksEvents: ['addtrack', 'removetrack', 'change'],
    stateOwnersUpdateHandlers: [
      (_handler, stateOwners) => {
        const { media, options } = stateOwners;
        if (!media) return;

        const updateDefaultSubtitlesCallback = (event?: Event) => {
          if (!options.defaultSubtitles) return;

          const nonSubsEvent =
            event &&
            ![TextTrackKinds.CAPTIONS, TextTrackKinds.SUBTITLES].includes(
              // @ts-ignore
              event?.track?.kind
            );

          if (nonSubsEvent) return;

          // NOTE: In this use case, since we're causing a side effect, no need to invoke `handler()`. (CJP)
          toggleSubtitleTracks(stateOwners, true);
        };

        media.addEventListener(
          'loadstart',
          updateDefaultSubtitlesCallback
        );
        media.textTracks?.addEventListener(
          'addtrack',
          updateDefaultSubtitlesCallback
        );
        media.textTracks?.addEventListener(
          'removetrack',
          updateDefaultSubtitlesCallback
        );

        return () => {
          media.removeEventListener(
            'loadstart',
            updateDefaultSubtitlesCallback
          );
          media.textTracks?.removeEventListener(
            'addtrack',
            updateDefaultSubtitlesCallback
          );
          media.textTracks?.removeEventListener(
            'removetrack',
            updateDefaultSubtitlesCallback
          );
        };
      },
    ],
  },
  mediaChaptersCues: {
    get(stateOwners: StateOwners) {
      const { media } = stateOwners;
      if (!media) return [];

      const [chaptersTrack] = getTextTracksList(media as HTMLVideoElement, {
        kind: TextTrackKinds.CHAPTERS,
      });

      return Array.from(chaptersTrack?.cues ?? []).map(
        ({ text, startTime, endTime }: VTTCue) => ({
          text: parseHtmlToText(text),
          startTime,
          endTime,
        })
      );
    },
    mediaEvents: ['loadstart', 'loadedmetadata'],
    textTracksEvents: ['addtrack', 'removetrack', 'change'],
    stateOwnersUpdateHandlers: [
      (handler, stateOwners) => {
        const { media } = stateOwners;
        if (!media) return;

        /** @TODO account for adds/removes/replacements of <track> (CJP) */
        const chaptersTrack = media.querySelector(
          'track[kind="chapters"][default][src]'
        );

        /* If `media` is a custom media element search in its shadow DOM. */
        const shadowChaptersTrack = media.shadowRoot?.querySelector(
          ':is(video,audio) > track[kind="chapters"][default][src]'
        );

        /** @ts-ignore */
        chaptersTrack?.addEventListener('load', handler);
        /** @ts-ignore */
        shadowChaptersTrack?.addEventListener('load', handler);

        return () => {
          /** @ts-ignore */
          chaptersTrack?.removeEventListener('load', handler);
          /** @ts-ignore */
          shadowChaptersTrack?.removeEventListener('load', handler);
        };
      },
    ],
  },
  // Modeling state tied to root node
  mediaIsPip: {
    get(stateOwners) {
      const { media, documentElement } = stateOwners;

      // Need a documentElement and a media StateOwner to be in PiP, so we're not PiP
      if (!media || !documentElement) return false;

      // Need a documentElement.pictureInPictureElement to be in PiP, so we're not PiP
      if (!documentElement.pictureInPictureElement) return false;

      // If documentElement.pictureInPictureElement is the media StateOwner, we're definitely in PiP
      if (documentElement.pictureInPictureElement === media) return true;

      // In this case (e.g. Safari), the pictureInPictureElement may be
      // the underlying <video> or <audio> element of a media StateOwner
      // that is a web component, even if it's not "visible" from the
      // documentElement, so check for that.
      if (documentElement.pictureInPictureElement instanceof HTMLMediaElement) {
        if (!media.localName?.includes('-')) return false;
        return containsComposedNode(
          media as Node,
          documentElement.pictureInPictureElement
        );
      }

      // In this case (e.g. Chrome), the pictureInPictureElement may be
      // a web component that is "visible" from the documentElement, but should
      // have its own pictureInPictureElement on its shadowRoot for whatever
      // is "visible" at that level. Since the media StateOwner may be nested
      // inside an indeterminite number of web components, traverse each layer
      // until we either find the media StateOwner or complete the recursive check.
      if (documentElement.pictureInPictureElement.localName.includes('-')) {
        let currentRoot = documentElement.pictureInPictureElement.shadowRoot;
        while (currentRoot?.pictureInPictureElement) {
          if (currentRoot.pictureInPictureElement === media) return true;
          currentRoot = currentRoot.pictureInPictureElement?.shadowRoot;
        }
      }

      return false;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
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
            if (!media.src) {
              console.warn(
                'MediaChrome: The media is not ready for picture-in-picture. It must have a src set.'
              );
              return;
            }
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
    get(stateOwners) {
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
    get(stateOwners) {
      const { media } = stateOwners;
      return media?.videoRenditions?.[media.videoRenditions?.selectedIndex]?.id;
    },
    set(value, stateOwners) {
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
    get(stateOwners) {
      const { media } = stateOwners;
      return [...(media?.audioTracks ?? [])];
    },
    mediaEvents: ['emptied', 'loadstart'],
    audioTracksEvents: ['addtrack', 'removetrack'],
  },
  mediaAudioTrackEnabled: {
    get(stateOwners) {
      const { media } = stateOwners;
      return [...(media?.audioTracks ?? [])].find(
        (audioTrack) => audioTrack.enabled
      )?.id;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      if (!media?.audioTracks) {
        console.warn(
          'MediaChrome: Audio track selection not supported by this media.'
        );
        return;
      }

      const audioTrackId = value;

      for (const track of media.audioTracks) {
        track.enabled = audioTrackId == track.id;
      }
    },
    mediaEvents: ['emptied'],
    audioTracksEvents: ['addtrack', 'removetrack', 'change'],
  },
  mediaIsFullscreen: {
    get(stateOwners) {
      return isFullscreen(stateOwners);
    },
    set(value, stateOwners) {
      if (!value) {
        exitFullscreen(stateOwners);
      } else {
        enterFullscreen(stateOwners);
      }
    },
    // older Safari version may require webkit-specific events
    rootEvents: ['fullscreenchange', 'webkitfullscreenchange'],
    // iOS requires webkit-specific events on the video.
    mediaEvents: [
      'webkitbeginfullscreen',
      'webkitendfullscreen',
      'webkitpresentationmodechanged',
    ],
  },
  mediaIsCasting: {
    // Note this relies on a customized castable-video element.
    get(stateOwners) {
      const { media } = stateOwners;

      if (!media?.remote || media.remote?.state === 'disconnected')
        return false;

      return !!media.remote.state;
    },
    set(value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
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
    get() {
      return false;
    },
    set(_value, stateOwners) {
      const { media } = stateOwners;
      if (!media) return;
      if (
        !(
          media.webkitShowPlaybackTargetPicker &&
          globalThis.WebKitPlaybackTargetAvailabilityEvent
        )
      ) {
        console.error(
          'MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment'
        );
        return;
      }
      media.webkitShowPlaybackTargetPicker();
    },
    mediaEvents: ['webkitcurrentplaybacktargetiswirelesschanged'],
  },
  mediaFullscreenUnavailable: {
    get(stateOwners) {
      const { media } = stateOwners;
      if (
        !fullscreenSupported ||
        !hasFullscreenSupport(media as HTMLVideoElement)
      )
        return AvailabilityStates.UNSUPPORTED;
      return undefined;
    },
  },
  mediaPipUnavailable: {
    get(stateOwners) {
      const { media } = stateOwners;
      if (!pipSupported || !hasPipSupport(media as HTMLVideoElement))
        return AvailabilityStates.UNSUPPORTED;
      else if (media?.disablePictureInPicture)
        return AvailabilityStates.UNAVAILABLE;
      return undefined;
    },
  },
  mediaVolumeUnavailable: {
    get(stateOwners) {
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
    get(stateOwners, { availability = 'not-available' } = {}) {
      const { media } = stateOwners;

      if (!castSupported || !media?.remote?.state) {
        return AvailabilityStates.UNSUPPORTED;
      }

      if (availability == null || availability === 'available')
        return undefined;

      return AvailabilityStates.UNAVAILABLE;
    },
    stateOwnersUpdateHandlers: [
      (handler, stateOwners) => {
        const { media } = stateOwners;
        if (!media) return;

        const remotePlaybackDisabled =
          media.disableRemotePlayback ||
          media.hasAttribute('disableremoteplayback');
        if (!remotePlaybackDisabled) {
          media?.remote
            ?.watchAvailability((availabilityBool) => {
              // Normalizing to `webkitplaybacktargetavailabilitychanged` for consistency.
              const availability = availabilityBool
                ? 'available'
                : 'not-available';
              // @ts-ignore
              handler({ availability });
            })
            .catch((error) => {
              if (error.name === 'NotSupportedError') {
                // Availability monitoring is not supported by the platform, so discovery of
                // remote playback devices will happen only after remote.prompt() is called.
                // @ts-ignore
                handler({ availability: null });
              } else {
                // Thrown if disableRemotePlayback is true for the media element
                // or if the source can't be played remotely.
                // Normalizing to `webkitplaybacktargetavailabilitychanged` for consistency.
                // @ts-ignore
                handler({ availability: 'not-available' });
              }
            });
        }
        return () => {
          media?.remote?.cancelWatchAvailability().catch(() => {});
        };
      },
    ],
  },
  mediaAirplayUnavailable: {
    get(_stateOwners, event) {
      if (!airplaySupported) return AvailabilityStates.UNSUPPORTED;
      // @ts-ignore
      if (event?.availability === 'not-available') {
        return AvailabilityStates.UNAVAILABLE;
      }
      // Either available via `availability` state or not yet known
      return undefined;
    },
    // NOTE: Keeping this event, as it's still the documented way of monitoring
    // for AirPlay availability from Apple.
    // See: https://developer.apple.com/documentation/webkitjs/adding_an_airplay_button_to_your_safari_media_controls#2940021 (CJP)
    mediaEvents: ['webkitplaybacktargetavailabilitychanged'],
    stateOwnersUpdateHandlers: [
      (handler, stateOwners) => {
        const { media } = stateOwners;
        if (!media) return;

        const remotePlaybackDisabled =
          media.disableRemotePlayback ||
          media.hasAttribute('disableremoteplayback');
        if (!remotePlaybackDisabled) {
          media?.remote
            ?.watchAvailability((availabilityBool) => {
              // Normalizing to `webkitplaybacktargetavailabilitychanged` for consistency.
              const availability = availabilityBool
                ? 'available'
                : 'not-available';
              // @ts-ignore
              handler({ availability });
            })
            .catch((error) => {
              if (error.name === 'NotSupportedError') {
                // Availability monitoring is not supported by the platform, so discovery of
                // remote playback devices will happen only after remote.prompt() is called.
                // @ts-ignore
                handler({ availability: null });
              } else {
                // Thrown if disableRemotePlayback is true for the media element
                // or if the source can't be played remotely.
                // Normalizing to `webkitplaybacktargetavailabilitychanged` for consistency.
                // @ts-ignore
                handler({ availability: 'not-available' });
              }
            });
        }
        return () => {
          media?.remote?.cancelWatchAvailability().catch(() => {});
        };
      },
    ],
  },
  mediaRenditionUnavailable: {
    get(stateOwners) {
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
    get(stateOwners) {
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
  mediaLang: {
    get(stateOwners) {
      const { options: { mediaLang } = {} } = stateOwners;
      return mediaLang ?? 'en';
    },
  },
};
