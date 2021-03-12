import MediaChromeButton from './src/js/media-chrome-button.js';
import MediaContainer from './src/js/media-container.js';
import MediaChromeHTMLElement from './src/js/media-chrome-html-element.js';
import MediaChromeMenuButton from './src/js/media-chrome-menu-button.js';
import MediaChromeMenu from './src/js/media-chrome-menu.js';
import MediaChromeMenuitem from './src/js/media-chrome-menuitem.js';
import MediaChromePopup from './src/js/media-chrome-popup.js';
import MediaChromeRange from './src/js/media-chrome-range.js';
import MediaChromeSubmenuMenuitem from './src/js/media-chrome-submenu-menuitem.js';
import MediaControlBar from './src/js/media-control-bar.js';
import MediaCurrentTimeDisplay from './src/js/media-current-time-display.js';
import MediaDurationDisplay from './src/js/media-duration-display.js';
import MediaForwardButton from './src/js/media-forward-button.js';
import MediaFullscreenButton from './src/js/media-fullscreen-button.js';
import MediaMuteButton from './src/js/media-mute-button.js';
import MediaPipButton from './src/js/media-pip-button.js';
import MediaPlayButton from './src/js/media-play-button.js';
import MediaPlaybackRateButton from './src/js/media-playback-rate-button.js';
import MediaPoster from './src/js/media-poster.js';
import MediaProgressRange from './src/js/media-progress-range.js';
import MediaReplayButton from './src/js/media-replay-button.js';
import MediaSettingsPopup from './src/js/media-settings-popup.js';
import MediaThumbnailPreviewElement from './src/js/media-thumbnail-preview-element.js';
import MediaTitleElement from './src/js/media-title-element.js';
import MediaVolumeRange from './src/js/media-volume-range.js';
import { isServer } from './src/js/utils/browser-env.js';

// Alias <media-container> as <media-chrome>
// and deprecate <media-chrome> as the main element
class MediaChrome extends MediaContainer {};
if (!isServer() && !window.customElements.get('media-chrome')) {
  window.customElements.define('media-chrome', MediaChrome);
}

export {
  MediaChromeButton,
  MediaContainer,
  MediaChromeHTMLElement,
  MediaChromeMenuButton,
  MediaChromeMenu,
  MediaChromeMenuitem,
  MediaChromePopup,
  MediaChromeRange,
  MediaChromeSubmenuMenuitem,
  MediaControlBar,
  MediaCurrentTimeDisplay,
  MediaDurationDisplay,
  MediaForwardButton,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlayButton,
  MediaPlaybackRateButton,
  MediaPoster,
  MediaProgressRange,
  MediaReplayButton,
  MediaSettingsPopup,
  MediaThumbnailPreviewElement,
  MediaTitleElement,
  MediaVolumeRange,
}
