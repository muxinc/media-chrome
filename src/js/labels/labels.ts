import currentTranslations from '../utils/translation-helper.js';

export type LabelOptions = { seekOffset?: number; playbackRate?: number };

export type MediaErrorLike = {
  code: number;
  message: string;
  [key: string]: any;
};

const defaultErrorTitles = {
  2: 'Network Error',
  3: 'Decode Error',
  4: 'Source Not Supported',
  5: 'Encryption Error',
};

const defaultErrorMessages = {
  2: 'A network error caused the media download to fail.',
  3: 'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.',
  4: 'An unsupported error occurred. The server or network failed, or your browser does not support this format.',
  5: 'The media is encrypted and there are no keys to decrypt it.',
};

// Returning null makes the error not show up in the UI.
export const formatError = (error: MediaErrorLike) => {
  if (error.code === 1) return null;
  return {
    title: defaultErrorTitles[error.code] ?? `Error ${error.code}`,
    message: defaultErrorMessages[error.code] ?? error.message,
  };
};

export const tooltipLabels = {
  ENTER_AIRPLAY: currentTranslations.tooltips.enterAirplay,
  EXIT_AIRPLAY: currentTranslations.tooltips.exitAirplay,
  AUDIO_TRACK_MENU: currentTranslations.tooltips.audioTrackMenu,
  CAPTIONS: currentTranslations.tooltips.captions,
  ENABLE_CAPTIONS: currentTranslations.tooltips.enableCaptions,
  DISABLE_CAPTIONS: currentTranslations.tooltips.disableCaptions,
  START_CAST: currentTranslations.tooltips.startCast,
  STOP_CAST: currentTranslations.tooltips.stopCast,
  ENTER_FULLSCREEN: currentTranslations.tooltips.enterFullscreen,
  EXIT_FULLSCREEN: currentTranslations.tooltips.exitFullscreen,
  MUTE: currentTranslations.tooltips.mute,
  UNMUTE: currentTranslations.tooltips.unmute,
  ENTER_PIP: currentTranslations.tooltips.enterPip,
  EXIT_PIP: currentTranslations.tooltips.exitPip,
  PLAY: currentTranslations.tooltips.play,
  PAUSE: currentTranslations.tooltips.pause,
  PLAYBACK_RATE: currentTranslations.tooltips.playbackRate,
  RENDITIONS: currentTranslations.tooltips.renditions,
  SEEK_BACKWARD: currentTranslations.tooltips.seekBackward,
  SEEK_FORWARD: currentTranslations.tooltips.seekForward,
  SETTINGS: currentTranslations.tooltips.settings,
};

export const nouns: Record<string, (options?: LabelOptions) => string> = {
  AUDIO_PLAYER: () => currentTranslations.nouns.audioPlayer,
  VIDEO_PLAYER: () => currentTranslations.nouns.videoPlayer,
  VOLUME: () => currentTranslations.nouns.volume,
  SEEK: () => currentTranslations.nouns.seek,
  CLOSED_CAPTIONS: () => currentTranslations.nouns.closedCaptions,
  PLAYBACK_RATE: ({ playbackRate = 1 } = {}) =>
    `${currentTranslations.nouns.playbackRate} ${playbackRate}`,
  PLAYBACK_TIME: () => currentTranslations.nouns.playbackTime,
  MEDIA_LOADING: () => currentTranslations.nouns.mediaLoading,
  SETTINGS: () => currentTranslations.nouns.settings,
  AUDIO_TRACKS: () => currentTranslations.nouns.audioTracks,
  QUALITY: () => currentTranslations.nouns.quality,
};

export const verbs: Record<string, (options?: LabelOptions) => string> = {
  PLAY: () => currentTranslations.verbs.play,
  PAUSE: () => currentTranslations.verbs.pause,
  MUTE: () => currentTranslations.verbs.mute,
  UNMUTE: () => currentTranslations.verbs.unmute,
  ENTER_AIRPLAY: () => currentTranslations.verbs.enterAirplay,
  EXIT_AIRPLAY: () => currentTranslations.verbs.exitAirplay,
  ENTER_CAST: () => currentTranslations.verbs.enterCast,
  EXIT_CAST: () => currentTranslations.verbs.exitCast,
  ENTER_FULLSCREEN: () => currentTranslations.verbs.enterFullscreen,
  EXIT_FULLSCREEN: () => currentTranslations.verbs.exitFullscreen,
  ENTER_PIP: () => currentTranslations.verbs.enterPip,
  EXIT_PIP: () => currentTranslations.verbs.exitPip,
  SEEK_FORWARD_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${currentTranslations.verbs.seekForward} ${seekOffset} ${currentTranslations.verbs.seconds}`,
  SEEK_BACK_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${currentTranslations.verbs.seekBack} ${seekOffset} ${currentTranslations.verbs.seconds}`,
  SEEK_LIVE: () => currentTranslations.verbs.seekLive,
  PLAYING_LIVE: () => currentTranslations.verbs.playingLive,
};

export default {
  ...nouns,
  ...verbs,
};
