export const verbs = {
    PLAY: () => 'play',
    PAUSE: () => 'pause',
    MUTE: () => 'mute',
    UNMUTE: () => 'unmute',
    ENTER_FULLSCREEN: () => 'enter fullscreen mode',
    EXIT_FULLSCREEN: () => 'exit fullscreen mode',
    ENTER_PIP: () => 'enter picture in picture mode',
    EXIT_PIP: () => 'exit picture in picture mode',
    SEEK_FORWARD_N_SECS: ({ seekOffset }) => `seek forward ${seekOffset} seconds`,
    SEEK_BACK_N_SECS: ({ seekOffset }) => `seek back ${seekOffset} seconds`,
};


export const nouns = {
    AUDIO_PLAYER: () => 'audio player',
    VIDEO_PLAYER: () => 'video player',
    PROGRESS_BAR: () => 'progress bar',
    VOLUME: () => 'volume',
};
