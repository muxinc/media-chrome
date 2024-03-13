import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaLoadingIndicator,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaCaptionsButton,
  MediaAirplayButton,
  MediaPipButton,
  MediaFullscreenButton,
  MediaPosterImage,
} from 'media-chrome/react';
import WebComponentRegistration from './web-component-registration';

const primaryColor = 'white';
const chromeStyles = {
  '--media-icon-color': primaryColor,
  '--media-range-thumb-background': primaryColor,
  '--media-range-bar-color': primaryColor,
  color: primaryColor,
};

export const Player = () => {
  return (
    <>
      <WebComponentRegistration />
      <MediaController style={chromeStyles} defaultSubtitles>
        <video
          suppressHydrationWarning
          slot="media"
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4"
          preload="auto"
          muted
          crossOrigin=""
        >
          <track
            label="thumbnails"
            default
            kind="metadata"
            src="https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/storyboard.vtt"
          />
          <track
            label="English"
            kind="captions"
            srcLang="en"
            src="./vtt/en-cc.vtt"
          />
        </video>
        <MediaPosterImage
          slot="poster"
          src="https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/thumbnail.jpg"
          placeholderSrc="data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAUADADASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAECBAP/xAAdEAEBAAEEAwAAAAAAAAAAAAAAARECAxITFCFR/8QAGQEAAwADAAAAAAAAAAAAAAAAAAEDAgQF/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAETERL/2gAMAwEAAhEDEQA/ANeC4ldyI1b2EtIzzrrIqYZLvl5FGkGdbfQzGPvo76WsPxXLlfqbaA5va2iVJADgPELACsD/2Q=="
        ></MediaPosterImage>
        <MediaLoadingIndicator
          suppressHydrationWarning
          noautohide
          slot="centered-chrome"
          style={{ '--media-loading-indicator-icon-height': '200px' }}
        ></MediaLoadingIndicator>
        <MediaControlBar>
          <MediaPlayButton></MediaPlayButton>
          <MediaSeekBackwardButton seekOffset={10}></MediaSeekBackwardButton>
          <MediaSeekForwardButton seekOffset={10}></MediaSeekForwardButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaTimeDisplay showDuration></MediaTimeDisplay>
          <MediaMuteButton></MediaMuteButton>
          <MediaVolumeRange></MediaVolumeRange>
          <MediaPlaybackRateButton></MediaPlaybackRateButton>
          <MediaCaptionsButton></MediaCaptionsButton>
          <MediaAirplayButton></MediaAirplayButton>
          <MediaPipButton></MediaPipButton>
          <MediaFullscreenButton></MediaFullscreenButton>
        </MediaControlBar>
      </MediaController>
    </>
  );
};
