export const MediaUIEvents = {
  MEDIA_PLAY_REQUEST: 'mediaplayrequest',
  MEDIA_PAUSE_REQUEST: 'mediapauserequest',
  MEDIA_MUTE_REQUEST: 'mediamuterequest',
  MEDIA_UNMUTE_REQUEST: 'mediaunmuterequest',
  MEDIA_LOOP_REQUEST: 'medialooprequest',
  MEDIA_VOLUME_REQUEST: 'mediavolumerequest',
  MEDIA_SEEK_REQUEST: 'mediaseekrequest',
  MEDIA_AIRPLAY_REQUEST: 'mediaairplayrequest',
  MEDIA_ENTER_FULLSCREEN_REQUEST: 'mediaenterfullscreenrequest',
  MEDIA_EXIT_FULLSCREEN_REQUEST: 'mediaexitfullscreenrequest',
  MEDIA_PREVIEW_REQUEST: 'mediapreviewrequest',
  MEDIA_ENTER_PIP_REQUEST: 'mediaenterpiprequest',
  MEDIA_EXIT_PIP_REQUEST: 'mediaexitpiprequest',
  MEDIA_ENTER_CAST_REQUEST: 'mediaentercastrequest',
  MEDIA_EXIT_CAST_REQUEST: 'mediaexitcastrequest',
  MEDIA_SHOW_TEXT_TRACKS_REQUEST: 'mediashowtexttracksrequest',
  MEDIA_HIDE_TEXT_TRACKS_REQUEST: 'mediahidetexttracksrequest',
  MEDIA_SHOW_SUBTITLES_REQUEST: 'mediashowsubtitlesrequest',
  MEDIA_DISABLE_SUBTITLES_REQUEST: 'mediadisablesubtitlesrequest',
  MEDIA_TOGGLE_SUBTITLES_REQUEST: 'mediatogglesubtitlesrequest',
  MEDIA_PLAYBACK_RATE_REQUEST: 'mediaplaybackraterequest',
  MEDIA_RENDITION_REQUEST: 'mediarenditionrequest',
  MEDIA_AUDIO_TRACK_REQUEST: 'mediaaudiotrackrequest',
  MEDIA_SEEK_TO_LIVE_REQUEST: 'mediaseektoliverequest',
  REGISTER_MEDIA_STATE_RECEIVER: 'registermediastatereceiver',
  UNREGISTER_MEDIA_STATE_RECEIVER: 'unregistermediastatereceiver',
} as const;

export type MediaUIEvents = typeof MediaUIEvents;

export const MediaStateReceiverAttributes = {
  MEDIA_CHROME_ATTRIBUTES: 'mediachromeattributes',
  MEDIA_CONTROLLER: 'mediacontroller',
} as const;

export type MediaStateReceiverAttributes = typeof MediaStateReceiverAttributes;

export const MediaUIProps = {
  MEDIA_AIRPLAY_UNAVAILABLE: 'mediaAirplayUnavailable',
  MEDIA_AUDIO_TRACK_ENABLED: 'mediaAudioTrackEnabled',
  MEDIA_AUDIO_TRACK_LIST: 'mediaAudioTrackList',
  MEDIA_AUDIO_TRACK_UNAVAILABLE: 'mediaAudioTrackUnavailable',
  MEDIA_BUFFERED: 'mediaBuffered',
  MEDIA_CAST_UNAVAILABLE: 'mediaCastUnavailable',
  MEDIA_CHAPTERS_CUES: 'mediaChaptersCues',
  MEDIA_CURRENT_TIME: 'mediaCurrentTime',
  MEDIA_DURATION: 'mediaDuration',
  MEDIA_ENDED: 'mediaEnded',
  MEDIA_ERROR: 'mediaError',
  MEDIA_ERROR_CODE: 'mediaErrorCode',
  MEDIA_ERROR_MESSAGE: 'mediaErrorMessage',
  MEDIA_FULLSCREEN_UNAVAILABLE: 'mediaFullscreenUnavailable',
  MEDIA_HAS_PLAYED: 'mediaHasPlayed',
  MEDIA_HEIGHT: 'mediaHeight',
  MEDIA_IS_AIRPLAYING: 'mediaIsAirplaying',
  MEDIA_IS_CASTING: 'mediaIsCasting',
  MEDIA_IS_FULLSCREEN: 'mediaIsFullscreen',
  MEDIA_IS_PIP: 'mediaIsPip',
  MEDIA_LOADING: 'mediaLoading',
  MEDIA_MUTED: 'mediaMuted',
  MEDIA_LOOP: 'mediaLoop',
  MEDIA_PAUSED: 'mediaPaused',
  MEDIA_PIP_UNAVAILABLE: 'mediaPipUnavailable',
  MEDIA_PLAYBACK_RATE: 'mediaPlaybackRate',
  MEDIA_PREVIEW_CHAPTER: 'mediaPreviewChapter',
  MEDIA_PREVIEW_COORDS: 'mediaPreviewCoords',
  MEDIA_PREVIEW_IMAGE: 'mediaPreviewImage',
  MEDIA_PREVIEW_TIME: 'mediaPreviewTime',
  MEDIA_RENDITION_LIST: 'mediaRenditionList',
  MEDIA_RENDITION_SELECTED: 'mediaRenditionSelected',
  MEDIA_RENDITION_UNAVAILABLE: 'mediaRenditionUnavailable',
  MEDIA_SEEKABLE: 'mediaSeekable',
  MEDIA_STREAM_TYPE: 'mediaStreamType',
  MEDIA_SUBTITLES_LIST: 'mediaSubtitlesList',
  MEDIA_SUBTITLES_SHOWING: 'mediaSubtitlesShowing',
  MEDIA_TARGET_LIVE_WINDOW: 'mediaTargetLiveWindow',
  MEDIA_TIME_IS_LIVE: 'mediaTimeIsLive',
  MEDIA_VOLUME: 'mediaVolume',
  MEDIA_VOLUME_LEVEL: 'mediaVolumeLevel',
  MEDIA_VOLUME_UNAVAILABLE: 'mediaVolumeUnavailable',
  MEDIA_LANG: 'mediaLang',
  MEDIA_WIDTH: 'mediaWidth',
} as const;

export type MediaUIProps = typeof MediaUIProps;

type Entries<T> = { [k in keyof T]: [k, T[k]] }[keyof T][];

type LowercaseValues<T extends Record<any, string>> = {
  [k in keyof T]: Lowercase<T[k]>;
};

type Writeable<T> = {
  -readonly [k in keyof T]: T[k];
};

type MediaUIPropsEntries = Entries<MediaUIProps>;
const MediaUIPropsEntries: MediaUIPropsEntries = Object.entries(
  MediaUIProps
) as MediaUIPropsEntries;

export type MediaUIAttributes = LowercaseValues<MediaUIProps>;
export const MediaUIAttributes = MediaUIPropsEntries.reduce(
  (dictObj, [key, propName]) => {
    // @ts-ignore
    dictObj[key] = propName.toLowerCase();
    return dictObj;
  },
  {} as Partial<Writeable<MediaUIAttributes>>
) as MediaUIAttributes;

const AdditionalStateChangeEvents = {
  USER_INACTIVE_CHANGE: 'userinactivechange',
  BREAKPOINTS_CHANGE: 'breakpointchange',
  BREAKPOINTS_COMPUTED: 'breakpointscomputed',
} as const;

export type MediaStateChangeEvents = {
  [k in keyof MediaUIProps]: Lowercase<MediaUIProps[k]>;
} & typeof AdditionalStateChangeEvents;

/** @TODO In a prior migration, we dropped the 'change' from our state change event types. Although a breaking change, we should consider re-adding (CJP) */
// export type MediaStateChangeEvents = {
//   [k in keyof MediaUIProps]: `${Lowercase<MediaUIProps[k]>}change`;
// } & typeof AdditionalStateChangeEvents;

export const MediaStateChangeEvents = MediaUIPropsEntries.reduce(
  (dictObj, [key, propName]) => {
    // @ts-ignore
    dictObj[key] = propName.toLowerCase();
    // dictObj[key] = `${propName.toLowerCase()}change`;
    return dictObj;
  },
  { ...AdditionalStateChangeEvents } as Partial<
    Writeable<MediaStateChangeEvents>
  >
) as MediaStateChangeEvents;

/** @TODO Make types more precise derivations, at least after updates to event type names mentioned above (CJP) */
export type StateChangeEventToAttributeMap = {
  [k in MediaStateChangeEvents[keyof MediaStateChangeEvents &
    keyof MediaUIAttributes]]: MediaUIAttributes[keyof MediaUIAttributes];
} & { userinactivechange: 'userinactive' };

// Maps from state change event type -> attribute name
export const StateChangeEventToAttributeMap = Object.entries(
  MediaStateChangeEvents
).reduce(
  (mapObj, [key, eventType]) => {
    const attrName = MediaUIAttributes[key];
    if (attrName) {
      mapObj[eventType] = attrName;
    }
    return mapObj;
  },
  { userinactivechange: 'userinactive' } as Partial<
    Writeable<StateChangeEventToAttributeMap>
  >
) as StateChangeEventToAttributeMap;

/** @TODO Make types more precise derivations, at least after updates to event type names mentioned above (CJP) */
export type AttributeToStateChangeEventMap = {
  [k in MediaUIAttributes[keyof MediaUIAttributes &
    keyof MediaStateChangeEvents]]: MediaStateChangeEvents[keyof MediaStateChangeEvents];
} & { userinactive: 'userinactivechange' };

// Maps from attribute name -> state change event type
export const AttributeToStateChangeEventMap = Object.entries(
  MediaUIAttributes
).reduce(
  (mapObj, [key, attrName]) => {
    const evtType = MediaStateChangeEvents[key];
    if (evtType) {
      mapObj[attrName] = evtType;
    }
    return mapObj;
  },
  { userinactive: 'userinactivechange' } as Partial<
    Writeable<AttributeToStateChangeEventMap>
  >
) as AttributeToStateChangeEventMap;

export const TextTrackKinds = {
  SUBTITLES: 'subtitles',
  CAPTIONS: 'captions',
  DESCRIPTIONS: 'descriptions',
  CHAPTERS: 'chapters',
  METADATA: 'metadata',
} as const;

export type TextTrackKinds =
  (typeof TextTrackKinds)[keyof typeof TextTrackKinds];

export const TextTrackModes = {
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
  SHOWING: 'showing',
} as const;

export type TextTrackModes = typeof TextTrackModes;

export const ReadyStates = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
} as const;

export type ReadyStates = typeof ReadyStates;

export const PointerTypes = {
  MOUSE: 'mouse',
  PEN: 'pen',
  TOUCH: 'touch',
} as const;

export type PointerTypes = typeof PointerTypes;

export const AvailabilityStates = {
  UNAVAILABLE: 'unavailable',
  UNSUPPORTED: 'unsupported',
} as const;

export type AvailabilityStates =
  (typeof AvailabilityStates)[keyof typeof AvailabilityStates];

export const StreamTypes = {
  LIVE: 'live',
  ON_DEMAND: 'on-demand',
  UNKNOWN: 'unknown',
} as const;

export type StreamTypes = (typeof StreamTypes)[keyof typeof StreamTypes];

export const VolumeLevels = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  OFF: 'off',
} as const;

export type VolumeLevels = typeof VolumeLevels;

export const WebkitPresentationModes = {
  INLINE: 'inline',
  FULLSCREEN: 'fullscreen',
  PICTURE_IN_PICTURE: 'picture-in-picture',
} as const;

export type WebkitPresentationModes = typeof WebkitPresentationModes;
