export const MediaUIEvents = {
    MEDIA_PLAY_REQUEST: 'mediaplayrequest',
    MEDIA_PAUSE_REQUEST: 'mediapauserequest',
    MEDIA_MUTE_REQUEST: 'mediamuterequest',
    MEDIA_UNMUTE_REQUEST: 'mediaunmuterequest',
    MEDIA_VOLUME_REQUEST: 'mediavolumerequest',
    MEDIA_SEEK_REQUEST: 'mediaseekrequest',
    MEDIA_ENTER_FULLSCREEN_REQUEST: 'mediaenterfullscreenrequest',
    MEDIA_EXIT_FULLSCREEN_REQUEST: 'mediaexitfullscreenrequest',
    MEDIA_PREVIEW_REQUEST: 'mediapreviewrequest',
    MEDIA_ENTER_PIP_REQUEST: 'mediaenterpiprequest',
    MEDIA_EXIT_PIP_REQUEST: 'mediaexitpiprequest',
    MEDIA_SHOW_TEXT_TRACKS_REQUEST: 'mediashowtexttracksrequest',
    MEDIA_HIDE_TEXT_TRACKS_REQUEST: 'mediahidetexttracksrequest',
    MEDIA_SHOW_CAPTIONS_REQUEST: 'mediashowcaptionsrequest',
    MEDIA_SHOW_SUBTITLES_REQUEST: 'mediashowsubtitlesrequest',
    MEDIA_DISABLE_CAPTIONS_REQUEST: 'mediadisablecaptionsrequest',
    MEDIA_DISABLE_SUBTITLE_REQUEST: 'mediadisablesubtitlesrequest',
    MEDIA_PLAYBACK_RATE_REQUEST: 'mediaplaybackraterequest',
    REGISTER_MEDIA_STATE_RECEIVER: 'registermediastatereceiver',
    UNREGISTER_MEDIA_STATE_RECEIVER: 'unregistermediastatereceiver',
};

export const MediaUIAttributes = {
    MEDIA_PAUSED: 'media-paused',
    MEDIA_MUTED: 'media-muted',
    MEDIA_VOLUME_LEVEL: 'media-volume-level',
    MEDIA_VOLUME: 'media-volume',
    MEDIA_IS_PIP: 'media-is-pip',
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
};

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
