import i18next, { initI18n } from '../i18n/i18n.js';
initI18n();

const { t: translationStrings } = i18next;

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
    message: defaultErrorMessages[error.code] ?? error.message
  };
}

export const tooltipLabels = {
  ENTER_AIRPLAY: translationStrings('tooltips.enterAirplay'),
  EXIT_AIRPLAY: translationStrings('tooltips.exitAirplay'),
  AUDIO_TRACK_MENU: translationStrings('tooltips.audioTrackMenu'),
  CAPTIONS: translationStrings('tooltips.captions'),
  ENABLE_CAPTIONS: translationStrings('tooltips.enableCaptions'),
  DISABLE_CAPTIONS: translationStrings('tooltips.disableCaptions'),
  START_CAST: translationStrings('tooltips.startCast'),
  STOP_CAST: translationStrings('tooltips.stopCast'),
  ENTER_FULLSCREEN: translationStrings('tooltips.enterFullscreen'),
  EXIT_FULLSCREEN: translationStrings('tooltips.exitFullscreen'),
  MUTE: translationStrings('tooltips.mute'),
  UNMUTE: translationStrings('tooltips.unmute'),
  ENTER_PIP: translationStrings('tooltips.enterPip'),
  EXIT_PIP: translationStrings('tooltips.exitPip'),
  PLAY: translationStrings('tooltips.play'),
  PAUSE: translationStrings('tooltips.pause'),
  PLAYBACK_RATE: translationStrings('tooltips.playbackRate'),
  RENDITIONS: translationStrings('tooltips.renditions'),
  SEEK_BACKWARD: translationStrings('tooltips.seekBackward'),
  SEEK_FORWARD: translationStrings('tooltips.seekForward'),
  SETTINGS: translationStrings('tooltips.settings'),
};

export const nouns: Record<string, (options?: LabelOptions) => string> = {
  AUDIO_PLAYER: () => translationStrings('nouns.audioPlayer'),
  VIDEO_PLAYER: () => translationStrings('nouns.videoPlayer'),
  VOLUME: () => translationStrings('nouns.volume'),
  SEEK: () => translationStrings('nouns.seek'),
  CLOSED_CAPTIONS: () => translationStrings('nouns.closedCaptions'),
  PLAYBACK_RATE: ({ playbackRate = 1 } = {}) =>
    `${translationStrings('nouns.playbackRate')} ${playbackRate}`,
  PLAYBACK_TIME: () => translationStrings('nouns.playbackTime'),
  MEDIA_LOADING: () => translationStrings('nouns.mediaLoading'),
  SETTINGS: () => translationStrings('nouns.settings'),
  AUDIO_TRACKS: () => translationStrings('nouns.audioTracks'),
  QUALITY: () => translationStrings('nouns.quality'),
};

export const verbs: Record<string, (options?: LabelOptions) => string> = {
  PLAY: () => translationStrings('verbs.play'),
  PAUSE: () => translationStrings('verbs.pause'),
  MUTE: () => translationStrings('verbs.mute'),
  UNMUTE: () => translationStrings('verbs.unmute'),
  LIVE: () => translationStrings('verbs.live'),
  ENTER_AIRPLAY: () => translationStrings('verbs.enterAirplay'),
  EXIT_AIRPLAY: () => translationStrings('verbs.exitAirplay'),
  ENTER_CAST: () => translationStrings('verbs.enterCast'),
  EXIT_CAST: () => translationStrings('verbs.exitCast'),
  ENTER_FULLSCREEN: () => translationStrings('verbs.enterFullscreen'),
  EXIT_FULLSCREEN: () => translationStrings('verbs.exitFullscreen'),
  ENTER_PIP: () => translationStrings('verbs.enterPip'),
  EXIT_PIP: () => translationStrings('verbs.exitPip'),
  SEEK_FORWARD_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${translationStrings(
      'verbs.seekForward'
    )} ${seekOffset} ${translationStrings('verbs.seconds')}`,
  SEEK_BACK_N_SECS: ({ seekOffset = 30 } = {}) =>
    `${translationStrings('verbs.seekBack')} ${seekOffset} ${translationStrings(
      'verbs.seconds'
    )}`,
  SEEK_LIVE: () => translationStrings('verbs.seekLive'),
  PLAYING_LIVE: () => translationStrings('verbs.playingLive'),
};

export default {
  ...nouns,
  ...verbs,
};
