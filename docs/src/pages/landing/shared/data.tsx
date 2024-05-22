/** @jsxImportSource react */
import {
  MediaController,
  MediaControlBar,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaCaptionsButton,
  MediaPlaybackRateButton,
  MediaPipButton,
  MediaFullscreenButton,
  MediaPreviewThumbnail,
} from 'media-chrome/react';
import type { MediaChromeListItem } from '../../../types';
// @ts-ignore
import { labels, timeUtils } from 'media-chrome';

const { formatAsTimePhrase } = timeUtils;

const mediaChromeListItems: MediaChromeListItem[] = [
  {
    name: 'controller',
    description:
      'Controls the interaction between the media element and the controls and provides general layout of the player.',
    component: MediaController,
    a11y: {
      role: 'region',
      'aria-label': labels.VIDEO_PLAYER(),
    },
  },
  {
    name: 'control-bar',
    description: 'Lay out the control elements in a single bar.',
    component: MediaControlBar,
  },
  {
    name: 'play-button',
    description: 'Play or pause the media.',
    component: MediaPlayButton,
    a11y: {
      role: 'button',
      'aria-label': labels.PLAY(),
    },
  },
  {
    name: 'seek-forward-button',
    description: 'Seek the playhead time forward.',
    component: MediaSeekForwardButton,
    a11y: {
      role: 'button',
      'aria-label': labels.SEEK_FORWARD_N_SECS({ seekOffset: 30 }),
    },
  },
  {
    name: 'seek-backward-button',
    description: 'Seek the playhead time backward.',
    component: MediaSeekBackwardButton,
    a11y: {
      role: 'button',
      'aria-label': labels.SEEK_BACK_N_SECS({ seekOffset: 30 }),
    },
  },
  {
    name: 'mute-button',
    description: 'Mute or unmute the media.',
    component: MediaMuteButton,
    a11y: {
      role: 'button',
      'aria-label': labels.MUTE(),
    },
  },
  {
    name: 'volume-range',
    description: 'Control the media volume.',
    component: MediaVolumeRange,
    a11y: {
      role: 'slider',
      'aria-label': labels.VOLUME(),
      'aria-valuetext': `${65}%`,
    },
  },
  {
    name: 'time-range',
    description:
      'See how far the playhead is through the media duration, and seek to new times.',
    component: MediaTimeRange,
    a11y: {
      role: 'slider',
      'aria-label': labels.SEEK(),
      'aria-valuetext': `${formatAsTimePhrase(-234)} of ${formatAsTimePhrase(
        360
      )}`,
    },
  },
  {
    name: 'thumbnail-preview',
    description: 'Show an image of the media at a particular time.',
    component: MediaPreviewThumbnail,
  },
  {
    name: 'time-display',
    description:
      'Show how far the playhead is through the media duration or show the remaining playback time.',
    component: MediaTimeDisplay,
    a11y: {
      role: 'slider',
      // NOTE: Should add a label for media-time-display in media-chrome!
      'aria-label': labels.PLAYBACK_TIME(),
      'aria-valuetext': `${formatAsTimePhrase(-234)} of ${formatAsTimePhrase(
        360
      )}`,
    },
  },
  {
    name: 'captions-button',
    description:
      'Turn closed captions on or off (or subtitles, if no captions are available).',
    component: MediaCaptionsButton,
    a11y: {
      role: 'switch',
      'aria-label': labels.CLOSED_CAPTIONS(),
    },
  },
  {
    name: 'playback-rate-button',
    description: 'Change the playback rate of the media.',
    component: MediaPlaybackRateButton,
    a11y: {
      role: 'button',
      'aria-label': labels.PLAYBACK_RATE({ playbackRate: 1 }),
    },
  },
  {
    name: 'pip-button',
    description:
      'Enter or exit picture-in-picture mode of the player for the media.',
    component: MediaPipButton,
    a11y: {
      role: 'button',
      'aria-label': labels.ENTER_PIP(),
    },
  },
  {
    name: 'fullscreen-button',
    description: 'Enter or exit fullscreen mode of the player for the media.',
    component: MediaFullscreenButton,
    a11y: {
      role: 'button',
      'aria-label': labels.ENTER_FULLSCREEN(),
    },
  },
];

export default mediaChromeListItems;
