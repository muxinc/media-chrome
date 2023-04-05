export * as constants from "./constants.js";
export { default as labels } from "./labels/labels.js";
export * as timeUtils from "./utils/time.js";
import MediaAirplayButton from "./media-airplay-button.js";
import MediaCastButton from "./media-cast-button.js";
import MediaChromeButton from "./media-chrome-button.js";
import MediaGestureReceiver from "./media-gesture-receiver.js";
export class MediaContainer extends MediaController {
}
import MediaController from "./media-controller.js";
import MediaChromeRange from "./media-chrome-range.js";
import MediaControlBar from "./media-control-bar.js";
import MediaCurrentTimeDisplay from "./media-current-time-display.js";
import MediaDurationDisplay from "./media-duration-display.js";
import MediaTimeDisplay from "./media-time-display.js";
import MediaCaptionsButton from "./media-captions-button.js";
import MediaSeekForwardButton from "./media-seek-forward-button.js";
import MediaFullscreenButton from "./media-fullscreen-button.js";
import MediaLiveButton from "./media-live-button.js";
import MediaMuteButton from "./media-mute-button.js";
import MediaPipButton from "./media-pip-button.js";
import MediaPlayButton from "./media-play-button.js";
import MediaPlaybackRateButton from "./media-playback-rate-button.js";
import MediaPosterImage from "./media-poster-image.js";
import MediaProgressRange from "./media-progress-range.js";
import MediaSeekBackwardButton from "./media-seek-backward-button.js";
import MediaPreviewTimeDisplay from "./media-preview-time-display.js";
import MediaPreviewThumbnail from "./media-preview-thumbnail.js";
import MediaTimeRange from "./media-time-range.js";
import MediaTitleElement from "./media-title-element.js";
import MediaLoadingIndicator from "./media-loading-indicator.js";
import MediaVolumeRange from "./media-volume-range.js";
export { MediaAirplayButton, MediaCastButton, MediaChromeButton, MediaGestureReceiver, MediaController, MediaChromeRange, MediaControlBar, MediaCurrentTimeDisplay, MediaDurationDisplay, MediaTimeDisplay, MediaCaptionsButton, MediaSeekForwardButton, MediaFullscreenButton, MediaLiveButton, MediaMuteButton, MediaPipButton, MediaPlayButton, MediaPlaybackRateButton, MediaPosterImage, MediaProgressRange, MediaSeekBackwardButton, MediaPreviewTimeDisplay, MediaPreviewThumbnail, MediaTimeRange, MediaTitleElement, MediaLoadingIndicator, MediaVolumeRange };

declare global {
    interface MediaControllerElement extends HTMLElement {}
    interface MediaPosterImageElement extends HTMLElement {}
    interface MediaLoadingIndicatorElement extends HTMLElement {}
    interface MediaControlBarElement extends HTMLElement {}
    interface MediaPlayButtonElement extends HTMLElement {}
    interface MediaSeekBackwardButtonElement extends HTMLElement {}
    interface MediaSeekForwardButtonElement extends HTMLElement {}
    interface MediaTimeRangeElement extends HTMLElement {}
    interface MediaTimeDisplayElement extends HTMLElement {}
    interface MediaMuteButtonElement extends HTMLElement {}
    interface MediaVolumeRangeElement extends HTMLElement {}
    interface MediaPlaybackRateButtonElement extends HTMLElement {}
    interface MediaCaptionsButtonElement extends HTMLElement {}
    interface MediaAirplayButtonElement extends HTMLElement {}
    interface MediaPipButtonElement extends HTMLElement {}
    interface MediaFullscreenButtonElement extends HTMLElement {}

    namespace React {
      interface CSSProperties {
        // Simple impl for all media chrome css vars (should followup to apply strict typing) (CJP)
        [index: `--media-${string}`]: any;
      }

      type DetailedHTMLProps2<
        E extends HTMLAttributes<T>,
        T
      > = ClassAttributes<T> & E;
      interface HTMLAttributes<T> {}

      interface MediaChromeAttributes<T> extends HTMLAttributes<T> {
        noautohide?: boolean | undefined;
      }

      interface MediaControllerHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaPosterImageHTMLAttributes<T>
        extends MediaChromeAttributes<T> {
        src?: string | undefined;
        placeholderSrc?: string | undefined;
      }

      interface MediaLoadingIndicatorHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaControlBarHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaPlayButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaSeekBackwardButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {
        seekOffset?: number | undefined;
      }

      interface MediaSeekForwardButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {
        seekOffset?: number | undefined;
      }

      interface MediaTimeRangeHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaTimeDisplayHTMLAttributes<T>
        extends MediaChromeAttributes<T> {
        showDuration?: boolean | undefined;
        remaining?: boolean | undefined;
      }

      interface MediaMuteButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaVolumeRangeHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaPlaybackRateButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {
        rates: number[] | undefined;
      }

      interface MediaCaptionsButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {
        defaultShowing: boolean | undefined;
      }

      interface MediaAirplayButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaPipButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}

      interface MediaFullscreenButtonHTMLAttributes<T>
        extends MediaChromeAttributes<T> {}
    }

    namespace JSX {
      interface IntrinsicElements {
        'media-controller': React.DetailedHTMLProps2<
          React.MediaControllerHTMLAttributes<MediaControllerElement>,
          MediaControllerElement
        >;
        'media-poster-image': React.DetailedHTMLProps2<
          React.MediaPosterImageHTMLAttributes<MediaPosterImageElement>,
          MediaPosterImageElement
        >;
        'media-loading-indicator': React.DetailedHTMLProps2<
          React.MediaLoadingIndicatorHTMLAttributes<MediaLoadingIndicatorElement>,
          MediaLoadingIndicatorElement
        >;
        'media-control-bar': React.DetailedHTMLProps2<
          React.MediaControlBarHTMLAttributes<MediaControlBarElement>,
          MediaControlBarElement
        >;
        'media-play-button': React.DetailedHTMLProps2<
          React.MediaPlayButtonHTMLAttributes<MediaPlayButtonElement>,
          MediaPlayButtonElement
        >;
        'media-seek-backward-button': React.DetailedHTMLProps2<
          React.MediaSeekBackwardButtonHTMLAttributes<MediaSeekBackwardButtonElement>,
          MediaSeekBackwardButtonElement
        >;
        'media-seek-forward-button': React.DetailedHTMLProps2<
          React.MediaSeekForwardButtonHTMLAttributes<MediaSeekForwardButtonElement>,
          MediaSeekForwardButtonElement
        >;
        'media-time-range': React.DetailedHTMLProps2<
          React.MediaTimeRangeHTMLAttributes<MediaTimeRangeElement>,
          MediaTimeRangeElement
        >;
        'media-time-display': React.DetailedHTMLProps2<
          React.MediaTimeDisplayHTMLAttributes<MediaTimeDisplayElement>,
          MediaTimeDisplayElement
        >;
        'media-mute-button': React.DetailedHTMLProps2<
          React.MediaMuteButtonHTMLAttributes<MediaMuteButtonElement>,
          MediaMuteButtonElement
        >;
        'media-volume-range': React.DetailedHTMLProps2<
          React.MediaVolumeRangeHTMLAttributes<MediaVolumeRangeElement>,
          MediaVolumeRangeElement
        >;
        'media-playback-rate-button': React.DetailedHTMLProps2<
          React.MediaPlaybackRateButtonHTMLAttributes<MediaPlaybackRateButtonElement>,
          MediaPlaybackRateButtonElement
        >;
        'media-captions-button': React.DetailedHTMLProps2<
          React.MediaCaptionsButtonHTMLAttributes<MediaCaptionsButtonElement>,
          MediaCaptionsButtonElement
        >;
        'media-airplay-button': React.DetailedHTMLProps2<
          React.MediaAirplayButtonHTMLAttributes<MediaAirplayButtonElement>,
          MediaAirplayButtonElement
        >;
        'media-pip-button': React.DetailedHTMLProps2<
          React.MediaPipButtonHTMLAttributes<MediaPipButtonElement>,
          MediaPipButtonElement
        >;
        'media-fullscreen-button': React.DetailedHTMLProps2<
          React.MediaFullscreenButtonHTMLAttributes<MediaFullscreenButtonElement>,
          MediaFullscreenButtonElement
        >;
      }
    }
  }
