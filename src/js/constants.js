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
  MEDIA_SHOW_CAPTIONS_REQUEST: 'mediashowcaptionsrequest',
  MEDIA_SHOW_SUBTITLES_REQUEST: 'mediashowsubtitlesrequest',
  MEDIA_DISABLE_CAPTIONS_REQUEST: 'mediadisablecaptionsrequest',
  MEDIA_DISABLE_SUBTITLES_REQUEST: 'mediadisablesubtitlesrequest',
  MEDIA_PLAYBACK_RATE_REQUEST: 'mediaplaybackraterequest',
  REGISTER_MEDIA_STATE_RECEIVER: 'registermediastatereceiver',
  UNREGISTER_MEDIA_STATE_RECEIVER: 'unregistermediastatereceiver',
};

export const MediaStateChangeEvents = {
  MEDIA_AIRPLAY_UNAVAILABLE: 'mediaairplayunavailablechange',
  MEDIA_PIP_UNAVAILABLE: 'mediapipunavailablechange',
  MEDIA_PAUSED: 'mediapausedchange',
  MEDIA_HAS_PLAYED: 'mediahasplayedchange',
  MEDIA_MUTED: 'mediamutedchange',
  MEDIA_VOLUME_LEVEL: 'mediavolumelevelchange',
  MEDIA_VOLUME: 'mediavolumechange',
  MEDIA_VOLUME_UNAVAILABLE: 'mediavolumeunavailablechange',
  MEDIA_IS_PIP: 'mediaispipchange',
  MEDIA_IS_CAST: 'mediaiscastchange',
  MEDIA_CAPTIONS_LIST: 'mediacaptionslistchange',
  MEDIA_SUBTITLES_LIST: 'mediasubtitleslistchange',
  MEDIA_CAPTIONS_SHOWING: 'mediacaptionsshowingchange',
  MEDIA_SUBTITLES_SHOWING: 'mediasubtitlesshowingchange',
  MEDIA_IS_FULLSCREEN: 'mediaisfullscreenchange',
  MEDIA_PLAYBACK_RATE: 'mediaplaybackratechange',
  MEDIA_CURRENT_TIME: 'mediacurrenttimechange',
  MEDIA_DURATION: 'mediadurationchange',
  MEDIA_PREVIEW_IMAGE: 'mediapreviewimagechange',
  MEDIA_PREVIEW_COORDS: 'mediapreviewcoordschange',
  // MEDIA_CHROME_ATTRIBUTES: 'media-chrome-attributes',
  // MEDIA_CONTROLLER: 'media-controller',
  MEDIA_LOADING: 'medialoadingchange',
  USER_INACTIVE: 'userinactivechange',
};

export const MediaUIAttributes = {
  MEDIA_AIRPLAY_UNAVAILABLE: 'media-airplay-unavailable',
  MEDIA_PIP_UNAVAILABLE: 'media-pip-unavailable',
  MEDIA_CAST_UNAVAILABLE: 'media-cast-unavailable',
  MEDIA_PAUSED: 'media-paused',
  MEDIA_HAS_PLAYED: 'media-has-played',
  MEDIA_MUTED: 'media-muted',
  MEDIA_VOLUME_LEVEL: 'media-volume-level',
  MEDIA_VOLUME: 'media-volume',
  MEDIA_VOLUME_UNAVAILABLE: 'media-volume-unavailable',
  MEDIA_IS_PIP: 'media-is-pip',
  MEDIA_IS_CAST: 'media-is-cast',
  MEDIA_CAPTIONS_LIST: 'media-captions-list',
  MEDIA_SUBTITLES_LIST: 'media-subtitles-list',
  MEDIA_CAPTIONS_SHOWING: 'media-captions-showing',
  MEDIA_SUBTITLES_SHOWING: 'media-subtitles-showing',
  MEDIA_IS_FULLSCREEN: 'media-is-fullscreen',
  MEDIA_PLAYBACK_RATE: 'media-playback-rate',
  MEDIA_CURRENT_TIME: 'media-current-time',
  MEDIA_DURATION: 'media-duration',
  MEDIA_PREVIEW_IMAGE: 'media-preview-image',
  MEDIA_PREVIEW_COORDS: 'media-preview-coords',
  MEDIA_CHROME_ATTRIBUTES: 'media-chrome-attributes',
  MEDIA_CONTROLLER: 'media-controller',
  MEDIA_LOADING: 'media-loading',
  MEDIA_BUFFERED: 'media-buffered',
};

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
  { userinactivechange: 'user-inactive' }
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
  { 'user-inactive': 'userinactivechange' }
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

export const AvailabilityStates = {
  UNAVAILABLE: 'unavailable',
  UNSUPPORTED: 'unsupported',
};
