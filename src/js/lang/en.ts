export const En = {
  'Start airplay': 'Start airplay',
  'Stop airplay': 'Stop airplay',
  Audio: 'Audio',
  Captions: 'Captions',
  'Enable captions': 'Enable captions',
  'Disable captions': 'Disable captions',
  'Start casting': 'Start casting',
  'Stop casting': 'Stop casting',
  'Enter fullscreen mode': 'Enter fullscreen mode',
  'Exit fullscreen mode': 'Exit fullscreen mode',
  Mute: 'Mute',
  Unmute: 'Unmute',
  'Enter picture in picture mode': 'Enter picture in picture mode',
  'Exit picture in picture mode': 'Exit picture in picture mode',
  Play: 'Play',
  Pause: 'Pause',
  'Playback rate': 'Playback rate',
  'Playback rate {playbackRate}': 'Playback rate {playbackRate}',
  Quality: 'Quality',
  'Seek backward': 'Seek backward',
  'Seek forward': 'Seek forward',
  Settings: 'Settings',
  Auto: 'Auto',
  'audio player': 'audio player',
  'video player': 'video player',
  volume: 'volume',
  seek: 'seek',
  'closed captions': 'closed captions',
  'current playback rate': 'current playback rate',
  'playback time': 'playback time',
  'media loading': 'media loading',

  settings: 'settings',
  'audio tracks': 'audio tracks',
  quality: 'quality',
  play: 'play',
  pause: 'pause',
  mute: 'mute',
  unmute: 'unmute',
  live: 'live',
  Off: 'Off',
  'start airplay': 'start airplay',
  'stop airplay': 'stop airplay',
  'start casting': 'start casting',
  'stop casting': 'stop casting',
  'enter fullscreen mode': 'enter fullscreen mode',
  'exit fullscreen mode': 'exit fullscreen mode',
  'enter picture in picture mode': 'enter picture in picture mode',
  'exit picture in picture mode': 'exit picture in picture mode',
  'seek to live': 'seek to live',
  'playing live': 'playing live',
  'seek back {seekOffset} seconds': 'seek back {seekOffset} seconds',
  'seek forward {seekOffset} seconds': 'seek forward {seekOffset} seconds',

  'Network Error': 'Network Error',
  'Decode Error': 'Decode Error',
  'Source Not Supported': 'Source Not Supported',
  'Encryption Error': 'Encryption Error',
  'A network error caused the media download to fail.':
    'A network error caused the media download to fail.',
  'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.':
    'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.',
  'An unsupported error occurred. The server or network failed, or your browser does not support this format.':
    'An unsupported error occurred. The server or network failed, or your browser does not support this format.',
  'The media is encrypted and there are no keys to decrypt it.':
    'The media is encrypted and there are no keys to decrypt it.',
} as const;

export type TranslateKeys = keyof typeof En;

export type TranslateDictionary = {
  [key in TranslateKeys]: string;
};
