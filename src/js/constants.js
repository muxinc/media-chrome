/**
 * @typedef {{
 *   MEDIA_PLAY_REQUEST: 'mediaplayrequest',
 *   MEDIA_PAUSE_REQUEST: 'mediapauserequest',
 *   MEDIA_MUTE_REQUEST: 'mediamuterequest',
 *   MEDIA_UNMUTE_REQUEST: 'mediaunmuterequest',
 *   MEDIA_VOLUME_REQUEST: 'mediavolumerequest',
 *   MEDIA_SEEK_REQUEST: 'mediaseekrequest',
 *   MEDIA_AIRPLAY_REQUEST: 'mediaairplayrequest',
 *   MEDIA_ENTER_FULLSCREEN_REQUEST: 'mediaenterfullscreenrequest',
 *   MEDIA_EXIT_FULLSCREEN_REQUEST: 'mediaexitfullscreenrequest',
 *   MEDIA_PREVIEW_REQUEST: 'mediapreviewrequest',
 *   MEDIA_ENTER_PIP_REQUEST: 'mediaenterpiprequest',
 *   MEDIA_EXIT_PIP_REQUEST: 'mediaexitpiprequest',
 *   MEDIA_ENTER_CAST_REQUEST: 'mediaentercastrequest',
 *   MEDIA_EXIT_CAST_REQUEST: 'mediaexitcastrequest',
 *   MEDIA_SHOW_TEXT_TRACKS_REQUEST: 'mediashowtexttracksrequest',
 *   MEDIA_HIDE_TEXT_TRACKS_REQUEST: 'mediahidetexttracksrequest',
 *   MEDIA_SHOW_SUBTITLES_REQUEST: 'mediashowsubtitlesrequest',
 *   MEDIA_DISABLE_SUBTITLES_REQUEST: 'mediadisablesubtitlesrequest',
 *   MEDIA_TOGGLE_SUBTITLES_REQUEST: 'mediatogglesubtitlesrequest',
 *   MEDIA_PLAYBACK_RATE_REQUEST: 'mediaplaybackraterequest',
 *   MEDIA_RENDITION_REQUEST: 'mediarenditionrequest',
 *   MEDIA_AUDIO_TRACK_REQUEST: 'mediaaudiotrackrequest',
 *   MEDIA_SEEK_TO_LIVE_REQUEST: 'mediaseektoliverequest',
 *   REGISTER_MEDIA_STATE_RECEIVER: 'registermediastatereceiver',
 *   UNREGISTER_MEDIA_STATE_RECEIVER: 'unregistermediastatereceiver',
 * }} MediaUIEvents
 */

/** @type {MediaUIEvents} */
export const MediaUIEvents = {
  MEDIA_PLAY_REQUEST: 'mediaplayrequest',
  MEDIA_PAUSE_REQUEST: 'mediapauserequest',
  MEDIA_MUTE_REQUEST: 'mediamuterequest',
  MEDIA_UNMUTE_REQUEST: 'mediaunmuterequest',
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
};

export const MediaStateReceiverAttributes = {
  MEDIA_CHROME_ATTRIBUTES: 'mediachromeattributes',
  MEDIA_CONTROLLER: 'mediacontroller',
};

/**
 * @typedef {{
 *   MEDIA_AIRPLAY_UNAVAILABLE: 'mediaAirplayUnavailable',
 *   MEDIA_FULLSCREEN_UNAVAILABLE: 'mediaFullscreenUnavailable',
 *   MEDIA_PIP_UNAVAILABLE: 'mediaPipUnavailable',
 *   MEDIA_CAST_UNAVAILABLE: 'mediaCastUnavailable',
 *   MEDIA_RENDITION_UNAVAILABLE: 'mediaRenditionUnavailable',
 *   MEDIA_AUDIO_TRACK_UNAVAILABLE: 'mediaAudioTrackUnavailable',
 *   MEDIA_PAUSED: 'mediaPaused',
 *   MEDIA_HAS_PLAYED: 'mediaHasPlayed',
 *   MEDIA_ENDED: 'mediaEnded',
 *   MEDIA_MUTED: 'mediaMuted',
 *   MEDIA_VOLUME_LEVEL: 'mediaVolumeLevel',
 *   MEDIA_VOLUME: 'mediaVolume',
 *   MEDIA_VOLUME_UNAVAILABLE: 'mediaVolumeUnavailable',
 *   MEDIA_IS_PIP: 'mediaIsPip',
 *   MEDIA_IS_CASTING: 'mediaIsCasting',
 *   MEDIA_IS_AIRPLAYING: 'mediaIsAirplaying',
 *   MEDIA_SUBTITLES_LIST: 'mediaSubtitlesList',
 *   MEDIA_SUBTITLES_SHOWING: 'mediaSubtitlesShowing',
 *   MEDIA_IS_FULLSCREEN: 'mediaIsFullscreen',
 *   MEDIA_PLAYBACK_RATE: 'mediaPlaybackRate',
 *   MEDIA_CURRENT_TIME: 'mediaCurrentTime',
 *   MEDIA_DURATION: 'mediaDuration',
 *   MEDIA_SEEKABLE: 'mediaSeekable',
 *   MEDIA_PREVIEW_TIME: 'mediaPreviewTime',
 *   MEDIA_PREVIEW_IMAGE: 'mediaPreviewImage',
 *   MEDIA_PREVIEW_COORDS: 'mediaPreviewCoords',
 *   MEDIA_PREVIEW_CHAPTER: 'mediaPreviewChapter',
 *   MEDIA_LOADING: 'mediaLoading',
 *   MEDIA_BUFFERED: 'mediaBuffered',
 *   MEDIA_STREAM_TYPE: 'mediaStreamType',
 *   MEDIA_TARGET_LIVE_WINDOW: 'mediaTargetLiveWindow',
 *   MEDIA_TIME_IS_LIVE: 'mediaTimeIsLive',
 *   MEDIA_RENDITION_LIST: 'mediaRenditionList',
 *   MEDIA_RENDITION_SELECTED: 'mediaRenditionSelected',
 *   MEDIA_AUDIO_TRACK_LIST: 'mediaAudioTrackList',
 *   MEDIA_AUDIO_TRACK_ENABLED: 'mediaAudioTrackEnabled',
 *   MEDIA_CHAPTERS_CUES: 'mediaChaptersCues',
 * }} MediaUIProps
 */

/** @type {MediaUIProps} */
export const MediaUIProps = {
  MEDIA_AIRPLAY_UNAVAILABLE: 'mediaAirplayUnavailable',
  MEDIA_FULLSCREEN_UNAVAILABLE: 'mediaFullscreenUnavailable',
  MEDIA_PIP_UNAVAILABLE: 'mediaPipUnavailable',
  MEDIA_CAST_UNAVAILABLE: 'mediaCastUnavailable',
  MEDIA_RENDITION_UNAVAILABLE: 'mediaRenditionUnavailable',
  MEDIA_AUDIO_TRACK_UNAVAILABLE: 'mediaAudioTrackUnavailable',
  MEDIA_PAUSED: 'mediaPaused',
  MEDIA_HAS_PLAYED: 'mediaHasPlayed',
  MEDIA_ENDED: 'mediaEnded',
  MEDIA_MUTED: 'mediaMuted',
  MEDIA_VOLUME_LEVEL: 'mediaVolumeLevel',
  MEDIA_VOLUME: 'mediaVolume',
  MEDIA_VOLUME_UNAVAILABLE: 'mediaVolumeUnavailable',
  MEDIA_IS_PIP: 'mediaIsPip',
  MEDIA_IS_CASTING: 'mediaIsCasting',
  MEDIA_IS_AIRPLAYING: 'mediaIsAirplaying',
  MEDIA_SUBTITLES_LIST: 'mediaSubtitlesList',
  MEDIA_SUBTITLES_SHOWING: 'mediaSubtitlesShowing',
  MEDIA_IS_FULLSCREEN: 'mediaIsFullscreen',
  MEDIA_PLAYBACK_RATE: 'mediaPlaybackRate',
  MEDIA_CURRENT_TIME: 'mediaCurrentTime',
  MEDIA_DURATION: 'mediaDuration',
  MEDIA_SEEKABLE: 'mediaSeekable',
  MEDIA_PREVIEW_TIME: 'mediaPreviewTime',
  MEDIA_PREVIEW_IMAGE: 'mediaPreviewImage',
  MEDIA_PREVIEW_COORDS: 'mediaPreviewCoords',
  MEDIA_PREVIEW_CHAPTER: 'mediaPreviewChapter',
  MEDIA_LOADING: 'mediaLoading',
  MEDIA_BUFFERED: 'mediaBuffered',
  MEDIA_STREAM_TYPE: 'mediaStreamType',
  MEDIA_TARGET_LIVE_WINDOW: 'mediaTargetLiveWindow',
  MEDIA_TIME_IS_LIVE: 'mediaTimeIsLive',
  MEDIA_RENDITION_LIST: 'mediaRenditionList',
  MEDIA_RENDITION_SELECTED: 'mediaRenditionSelected',
  MEDIA_AUDIO_TRACK_LIST: 'mediaAudioTrackList',
  MEDIA_AUDIO_TRACK_ENABLED: 'mediaAudioTrackEnabled',
  MEDIA_CHAPTERS_CUES: 'mediaChaptersCues',
};

const MediaUIPropsEntries = /** @type {[keyof MediaUIProps, string][]} */ (
  Object.entries(MediaUIProps)
);

export const MediaUIAttributes =
  /** @type {{ [k in keyof MediaUIProps]: string }} */ (
    MediaUIPropsEntries.reduce((dictObj, [key, propName]) => {
      dictObj[key] = `${propName.toLowerCase()}`;
      return dictObj;
    }, /** @type {Partial<{ [k in keyof MediaUIProps]: string }>} */ ({}))
  );

export const MediaStateChangeEvents =
  /** @type {{ [k in keyof MediaUIProps | 'USER_INACTIVE' | 'BREAKPOINTS_CHANGE' | 'BREAKPOINTS_COMPUTED']: string }} */ (
    MediaUIPropsEntries.reduce(
      (dictObj, [key, propName]) => {
        dictObj[key] = `${propName.toLowerCase()}`;
        return dictObj;
      },
      /** @type {Partial<{ [k in keyof MediaUIProps | 'USER_INACTIVE' | 'BREAKPOINTS_CHANGE' | 'BREAKPOINTS_COMPUTED']: string  }>} */ ({
        USER_INACTIVE: 'userinactivechange',
        BREAKPOINTS_CHANGE: 'breakpointchange',
        BREAKPOINTS_COMPUTED: 'breakpointscomputed',
      })
    )
  );

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
  { userinactivechange: 'userinactive' }
);

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
  { userinactive: 'userinactivechange' }
);

export const TextTrackKinds = {
  SUBTITLES: 'subtitles',
  CAPTIONS: 'captions',
  DESCRIPTIONS: 'descriptions',
  CHAPTERS: 'chapters',
  METADATA: 'metadata',
};

export const TextTrackModes = {
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
  SHOWING: 'showing',
};

export const ReadyStates = {
  HAVE_NOTHING: 0,
  HAVE_METADATA: 1,
  HAVE_CURRENT_DATA: 2,
  HAVE_FUTURE_DATA: 3,
  HAVE_ENOUGH_DATA: 4,
};

export const PointerTypes = {
  MOUSE: 'mouse',
  PEN: 'pen',
  TOUCH: 'touch',
};

/**
 * @type {{
 *   UNAVAILABLE: 'unavailable';
 *   UNSUPPORTED: 'unsupported';
 * }}
 */
export const AvailabilityStates = {
  UNAVAILABLE: 'unavailable',
  UNSUPPORTED: 'unsupported',
};

/**
 * @type {{
 *   LIVE: 'live';
 *   ON_DEMAND: 'on-demand';
 *   UNKNOWN: 'unknown';
 * }}
 */
export const StreamTypes = {
  LIVE: 'live',
  ON_DEMAND: 'on-demand',
  UNKNOWN: 'unknown',
};

/**
 * @type {{
 *   HIGH: 'high';
 *   MEDIUM: 'medium';
 *   LOW: 'low';
 *   OFF: 'off';
 * }}
 */
export const VolumeLevels = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  OFF: 'off',
};

/**
 * @type {{
 *   INLINE: 'inline';
 *   FULLSCREEN: 'fullscreen';
 *   PICTURE_IN_PICTURE: 'picture-in-picture';
 * }}
 */
export const WebkitPresentationModes = {
  INLINE: 'inline',
  FULLSCREEN: 'fullscreen',
  PICTURE_IN_PICTURE: 'picture-in-picture',
};
