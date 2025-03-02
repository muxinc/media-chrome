import { En } from '../lang/en.js';
import { Es } from '../lang/es.js';
import { Fr } from '../lang/fr.js';
import { Pt } from '../lang/pt.js';

export type TranslationType = {
  tooltips: {
    enterAirplay: string;
    exitAirplay: string;
    audioTrackMenu: string;
    captions: string;
    enableCaptions: string;
    disableCaptions: string;
    startCast: string;
    stopCast: string;
    enterFullscreen: string;
    exitFullscreen: string;
    mute: string;
    unmute: string;
    enterPip: string;
    exitPip: string;
    play: string;
    pause: string;
    playbackRate: string;
    renditions: string;
    seekBackward: string;
    seekForward: string;
    settings: string;
  };
  nouns: {
    audioPlayer: string;
    videoPlayer: string;
    volume: string;
    seek: string;
    closedCaptions: string;
    playbackRate: string;
    playbackTime: string;
    mediaLoading: string;
    settings: string;
    audioTracks: string;
    quality: string;
  };
  verbs: {
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    live: string;
    enterAirplay: string;
    exitAirplay: string;
    enterCast: string;
    exitCast: string;
    enterFullscreen: string;
    exitFullscreen: string;
    enterPip: string;
    exitPip: string;
    seekLive: string;
    playingLive: string;
    seekBack: string;
    seekForward: string;
    seconds: string;
  };
};

const translationsLanguages: Record<string, TranslationType> = {
  es: Es,
  en: En,
  fr: Fr,
  pt: Pt,
};

const getBrowserLanguage = (): string =>
  navigator.language.split('-')[0] || 'en';

const getPreferredLanguage = (): string => getBrowserLanguage();

const currentTranslations = translationsLanguages[getPreferredLanguage()] || En;

export default currentTranslations;
