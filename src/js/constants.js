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
  MEDIA_PLAYBACK_RATE_REQUEST: 'mediaplaybackraterequest',
  MEDIA_SEEK_TO_LIVE_REQUEST: 'mediaseektoliverequest',
  REGISTER_MEDIA_STATE_RECEIVER: 'registermediastatereceiver',
  UNREGISTER_MEDIA_STATE_RECEIVER: 'unregistermediastatereceiver',
};

export const MediaStateChangeEvents = {
  MEDIA_AIRPLAY_UNAVAILABLE: 'mediaairplayunavailablechange',
  MEDIA_FULLSCREEN_UNAVAILABLE: 'mediafullscreenunavailablechange',
  MEDIA_PIP_UNAVAILABLE: 'mediapipunavailablechange',
  MEDIA_CAST_UNAVAILABLE: 'mediacastunavailablechange',
  MEDIA_PAUSED: 'mediapausedchange',
  MEDIA_HAS_PLAYED: 'mediahasplayedchange',
  MEDIA_ENDED: 'mediaendedchange',
  MEDIA_MUTED: 'mediamutedchange',
  MEDIA_VOLUME_LEVEL: 'mediavolumelevelchange',
  MEDIA_VOLUME: 'mediavolumechange',
  MEDIA_VOLUME_UNAVAILABLE: 'mediavolumeunavailablechange',
  MEDIA_IS_PIP: 'mediaispipchange',
  MEDIA_IS_CASTING: 'mediaiscastingchange',
  MEDIA_SUBTITLES_LIST: 'mediasubtitleslistchange',
  MEDIA_SUBTITLES_SHOWING: 'mediasubtitlesshowingchange',
  MEDIA_IS_FULLSCREEN: 'mediaisfullscreenchange',
  MEDIA_PLAYBACK_RATE: 'mediaplaybackratechange',
  MEDIA_CURRENT_TIME: 'mediacurrenttimechange',
  MEDIA_DURATION: 'mediadurationchange',
  MEDIA_SEEKABLE: 'mediaseekablechange',
  MEDIA_PREVIEW_TIME: 'mediapreviewtimechange',
  MEDIA_PREVIEW_IMAGE: 'mediapreviewimagechange',
  MEDIA_PREVIEW_COORDS: 'mediapreviewcoordschange',
  MEDIA_LOADING: 'medialoadingchange',
  MEDIA_BUFFERED: 'mediabufferedchange',
  MEDIA_STREAM_TYPE: 'mediastreamtypechange',
  MEDIA_TARGET_LIVE_WINDOW: 'mediatargetlivewindowchange',
  MEDIA_TIME_IS_LIVE: 'mediatimeislivechange',
  USER_INACTIVE: 'userinactivechange',
  BREAKPOINTS_CHANGE: 'breakpointchange',
};

export const MediaStateReceiverAttributes = {
  MEDIA_CHROME_ATTRIBUTES: 'mediachromeattributes',
  MEDIA_CONTROLLER: 'mediacontroller',
};

export const MediaUIProps = {
  MEDIA_AIRPLAY_UNAVAILABLE: 'mediaAirplayUnavailable',
  MEDIA_FULLSCREEN_UNAVAILABLE: 'mediaFullscreenUnavailable',
  MEDIA_PIP_UNAVAILABLE: 'mediaPipUnavailable',
  MEDIA_CAST_UNAVAILABLE: 'mediaCastUnavailable',
  MEDIA_PAUSED: 'mediaPaused',
  MEDIA_HAS_PLAYED: 'mediaHasPlayed',
  MEDIA_ENDED: 'mediaEnded',
  MEDIA_MUTED: 'mediaMuted',
  MEDIA_VOLUME_LEVEL: 'mediaVolumeLevel',
  MEDIA_VOLUME: 'mediaVolume',
  MEDIA_VOLUME_UNAVAILABLE: 'mediaVolumeUnavailable',
  MEDIA_IS_PIP: 'mediaIsPip',
  MEDIA_IS_CASTING: 'mediaIsCasting',
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
  MEDIA_LOADING: 'mediaLoading',
  MEDIA_BUFFERED: 'mediaBuffered',
  MEDIA_STREAM_TYPE: 'mediaStreamType',
  MEDIA_TARGET_LIVE_WINDOW: 'mediaTargetLiveWindow',
  MEDIA_TIME_IS_LIVE: 'mediaTimeIsLive',
};

export const MediaUIAttributes = {
  MEDIA_AIRPLAY_UNAVAILABLE: 'mediaairplayunavailable',
  MEDIA_FULLSCREEN_UNAVAILABLE: 'mediafullscreenunavailable',
  MEDIA_PIP_UNAVAILABLE: 'mediapipunavailable',
  MEDIA_CAST_UNAVAILABLE: 'mediacastunavailable',
  MEDIA_PAUSED: 'mediapaused',
  MEDIA_HAS_PLAYED: 'mediahasplayed',
  MEDIA_ENDED: 'mediaended',
  MEDIA_MUTED: 'mediamuted',
  MEDIA_VOLUME_LEVEL: 'mediavolumelevel',
  MEDIA_VOLUME: 'mediavolume',
  MEDIA_VOLUME_UNAVAILABLE: 'mediavolumeunavailable',
  MEDIA_IS_PIP: 'mediaispip',
  MEDIA_IS_CASTING: 'mediaiscasting',
  MEDIA_SUBTITLES_LIST: 'mediasubtitleslist',
  MEDIA_SUBTITLES_SHOWING: 'mediasubtitlesshowing',
  MEDIA_IS_FULLSCREEN: 'mediaisfullscreen',
  MEDIA_PLAYBACK_RATE: 'mediaplaybackrate',
  MEDIA_CURRENT_TIME: 'mediacurrenttime',
  MEDIA_DURATION: 'mediaduration',
  MEDIA_SEEKABLE: 'mediaseekable',
  MEDIA_PREVIEW_TIME: 'mediapreviewtime',
  MEDIA_PREVIEW_IMAGE: 'mediapreviewimage',
  MEDIA_PREVIEW_COORDS: 'mediapreviewcoords',
  MEDIA_LOADING: 'medialoading',
  MEDIA_BUFFERED: 'mediabuffered',
  MEDIA_STREAM_TYPE: 'mediastreamtype',
  MEDIA_TARGET_LIVE_WINDOW: 'mediatargetlivewindow',
  MEDIA_TIME_IS_LIVE: 'mediatimeislive',
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

export const AvailabilityStates = {
  UNAVAILABLE: 'unavailable',
  UNSUPPORTED: 'unsupported',
};

export const StreamTypes = {
  LIVE: 'live',
  ON_DEMAND: 'on-demand',
  UNKNOWN: 'unknown',
};
