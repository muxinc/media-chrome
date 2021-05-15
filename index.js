import MediaChromeButton from './src/js/media-chrome-button.js';
// import MediaContainer from './src/js/media-container.js';
import MediaController from './src/js/media-controller.js';
import MediaChromeHTMLElement from './src/js/media-chrome-html-element.js';
import MediaChromeRange from './src/js/media-chrome-range.js';
import MediaControlBar from './src/js/media-control-bar.js';
import MediaCurrentTimeDisplay from './src/js/media-current-time-display.js';
import MediaDurationDisplay from './src/js/media-duration-display.js';
import MediaSeekForwardButton from './src/js/media-seek-forward-button.js';
import MediaFullscreenButton from './src/js/media-fullscreen-button.js';
import MediaMuteButton from './src/js/media-mute-button.js';
import MediaPipButton from './src/js/media-pip-button.js';
import MediaPlayButton from './src/js/media-play-button.js';
import MediaPlaybackRateButton from './src/js/media-playback-rate-button.js';
import MediaPoster from './src/js/media-poster.js';
import MediaProgressRange from './src/js/media-progress-range.js';
import MediaClipSelector from './src/js/media-clip-selector.js';
import MediaSeekBackwardButton from './src/js/media-seek-backward-button.js';
import MediaThumbnailPreviewElement from './src/js/media-thumbnail-preview-element.js';
import MediaTimeRange from './src/js/media-time-range.js';
import MediaTitleElement from './src/js/media-title-element.js';
import MediaVolumeRange from './src/js/media-volume-range.js';
import { Window as window } from './src/js/utils/server-safe-globals.js';

// Alias <media-controller> as <media-chrome>
// Might move MediaChrome to include default controls
class MediaChrome extends MediaController {};
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
  MediaChromeHTMLElement,
  MediaChromeRange,
  MediaControlBar,
  MediaCurrentTimeDisplay,
  MediaDurationDisplay,
  MediaSeekForwardButton,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaPoster,
  MediaProgressRange,
  MediaClipSelector,
  MediaSeekBackwardButton,
  MediaThumbnailPreviewElement,
  MediaTimeRange,
  MediaTitleElement,
  MediaVolumeRange,
}
