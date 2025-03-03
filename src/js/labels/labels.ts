import { getCurrentTranslations } from '../utils/translation-helper.js';

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
  ENTER_AIRPLAY: getCurrentTranslations().tooltips.enterAirplay,
  EXIT_AIRPLAY: getCurrentTranslations().tooltips.exitAirplay,
  AUDIO_TRACK_MENU: getCurrentTranslations().tooltips.audioTrackMenu,
  CAPTIONS: getCurrentTranslations().tooltips.captions,
  ENABLE_CAPTIONS: getCurrentTranslations().tooltips.enableCaptions,
  DISABLE_CAPTIONS: getCurrentTranslations().tooltips.disableCaptions,
  START_CAST: getCurrentTranslations().tooltips.startCast,
  STOP_CAST: getCurrentTranslations().tooltips.stopCast,
  ENTER_FULLSCREEN: getCurrentTranslations().tooltips.enterFullscreen,
  EXIT_FULLSCREEN: getCurrentTranslations().tooltips.exitFullscreen,
  MUTE: getCurrentTranslations().tooltips.mute,
  UNMUTE: getCurrentTranslations().tooltips.unmute,
  ENTER_PIP: getCurrentTranslations().tooltips.enterPip,
  EXIT_PIP: getCurrentTranslations().tooltips.exitPip,
  PLAY: getCurrentTranslations().tooltips.play,
  PAUSE: getCurrentTranslations().tooltips.pause,
  PLAYBACK_RATE: getCurrentTranslations().tooltips.playbackRate,
  RENDITIONS: getCurrentTranslations().tooltips.renditions,
  SEEK_BACKWARD: getCurrentTranslations().tooltips.seekBackward,
  SEEK_FORWARD: getCurrentTranslations().tooltips.seekForward,
  SETTINGS: getCurrentTranslations().tooltips.settings,
};

export const nouns: Record<string, (options?: LabelOptions) => string> = {
  AUDIO_PLAYER: () => getCurrentTranslations().nouns.audioPlayer,
  VIDEO_PLAYER: () => getCurrentTranslations().nouns.videoPlayer,
  VOLUME: () => getCurrentTranslations().nouns.volume,
  SEEK: () => getCurrentTranslations().nouns.seek,
  CLOSED_CAPTIONS: () => getCurrentTranslations().nouns.closedCaptions,
  PLAYBACK_RATE: ({ playbackRate = 1 } = {}) =>
    `${getCurrentTranslations().nouns.playbackRate} ${playbackRate}`,
  PLAYBACK_TIME: () => getCurrentTranslations().nouns.playbackTime,
  MEDIA_LOADING: () => getCurrentTranslations().nouns.mediaLoading,
  SETTINGS: () => getCurrentTranslations().nouns.settings,
  AUDIO_TRACKS: () => getCurrentTranslations().nouns.audioTracks,
  QUALITY: () => getCurrentTranslations().nouns.quality,
};

export const verbs: Record<string, (options?: LabelOptions) => string> = {
  PLAY: () => getCurrentTranslations().verbs.play,
  PAUSE: () => getCurrentTranslations().verbs.pause,
  MUTE: () => getCurrentTranslations().verbs.mute,
  UNMUTE: () => getCurrentTranslations().verbs.unmute,
  ENTER_AIRPLAY: () => getCurrentTranslations().verbs.enterAirplay,
  EXIT_AIRPLAY: () => getCurrentTranslations().verbs.exitAirplay,
  ENTER_CAST: () => getCurrentTranslations().verbs.enterCast,
  EXIT_CAST: () => getCurrentTranslations().verbs.exitCast,
  ENTER_FULLSCREEN: () => getCurrentTranslations().verbs.enterFullscreen,
  EXIT_FULLSCREEN: () => getCurrentTranslations().verbs.exitFullscreen,
  ENTER_PIP: () => getCurrentTranslations().verbs.enterPip,
  EXIT_PIP: () => getCurrentTranslations().verbs.exitPip,
  SEEK_FORWARD_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${getCurrentTranslations().verbs.seekForward} ${seekOffset} ${
      getCurrentTranslations().verbs.seconds
    }`,
  SEEK_BACK_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${getCurrentTranslations().verbs.seekBack} ${seekOffset} ${
      getCurrentTranslations().verbs.seconds
    }`,
  SEEK_LIVE: () => getCurrentTranslations().verbs.seekLive,
  PLAYING_LIVE: () => getCurrentTranslations().verbs.playingLive,
};

export default {
  ...nouns,
  ...verbs,
};
