import MediaChromeButton from './media-chrome-button.js';
// import MediaContainer from './src/js/media-container.js';
import MediaController from './media-controller.js';
import MediaChromeRange from './media-chrome-range.js';
import MediaControlBar from './media-control-bar.js';
import MediaCurrentTimeDisplay from './media-current-time-display.js';
import MediaDurationDisplay from './media-duration-display.js';
import MediaTimeDisplay from './media-time-display.js';
import MediaCaptionsButton from './media-captions-button.js';
import MediaSeekForwardButton from './media-seek-forward-button.js';
import MediaFullscreenButton from './media-fullscreen-button.js';
import MediaMuteButton from './media-mute-button.js';
import MediaPipButton from './media-pip-button.js';
import MediaPlayButton from './media-play-button.js';
import MediaPlaybackRateButton from './media-playback-rate-button.js';
import MediaProgressRange from './media-progress-range.js';
import MediaSeekBackwardButton from './media-seek-backward-button.js';
import MediaThumbnailPreview from './media-thumbnail-preview.js';
import MediaTimeRange from './media-time-range.js';
import MediaTitleElement from './media-title-element.js';
import MediaVolumeRange from './media-volume-range.js';
import { Window as window } from './utils/server-safe-globals.js';

// Alias <media-controller> as <media-chrome>
// Might move MediaChrome to include default controls
class MediaChrome extends MediaController { };
if (!window.customElements.get('media-chrome')) {
  window.customElements.define('media-chrome', MediaChrome);
}

// Alias <media-controller> as <media-container>
// to not break existing installs in transition.
// Eventually expose media-container as unique element
class MediaContainer extends MediaController {
  constructor() {
    super();
    console.warn('MediaChrome: <media-container> is deprecated. Use <media-controller>.');
  }
};
if (!window.customElements.get('media-container')) {
  window.customElements.define('media-container', MediaContainer);
}

export {
  MediaChromeButton,
  MediaContainer,
  MediaController,
  MediaChromeRange,
  MediaControlBar,
  MediaCurrentTimeDisplay,
  MediaDurationDisplay,
  MediaTimeDisplay,
  MediaCaptionsButton,
  MediaSeekForwardButton,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaProgressRange,
  MediaSeekBackwardButton,
  MediaThumbnailPreview,
  MediaThumbnailPreview as MediaThumbnailPreviewElement,
  MediaTimeRange,
  MediaTitleElement,
  MediaVolumeRange,
}
