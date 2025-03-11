'use client';
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
import {
  MediaPlaybackRateMenu,
  MediaPlaybackRateMenuButton,
} from 'media-chrome/react/menu';

import { useState } from 'react';

const chromeStyles = {
  '--media-primary-color': 'white',
};

const toggleBool = (prev: boolean|undefined) => !prev;

export const Player = () => {
  const [mounted, setMounted] = useState<boolean>(true);
  const [noDefaultStore, setNoDefaultStore] = useState(false);
  return (
    <>
      <div>
        <button id="mount-btn" onClick={() => setMounted(toggleBool)}>
          {mounted ? 'Unmount' : 'Mount'}
        </button>
        <span style={{ padding: '10px' }}>
          <label htmlFor="toggleNoDefaultStore">
            <code>noDefaultStore</code> (applies only on (re)creation)
          </label>
          <input
            id="toggleNoDefaultStore"
            type="checkbox"
            onChange={() => setNoDefaultStore(toggleBool)}
          ></input>
        </span>
      </div>
      <br />
      {mounted && (<MediaController hotkeys={"noarrowleft noarrowright"} style={chromeStyles as any} gesturesDisabled defaultSubtitles noDefaultStore={noDefaultStore}>
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
          noAutohide
          slot="centered-chrome"
          style={{ '--media-loading-indicator-icon-height': '200px' } as any}
        ></MediaLoadingIndicator>
        <MediaPlaybackRateMenu hidden anchor="auto" />
        <MediaControlBar>
          <MediaPlayButton></MediaPlayButton>
          <MediaSeekBackwardButton seekOffset={10}></MediaSeekBackwardButton>
          <MediaSeekForwardButton seekOffset={10}></MediaSeekForwardButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaTimeDisplay showDuration></MediaTimeDisplay>
          <MediaMuteButton></MediaMuteButton>
          <MediaVolumeRange></MediaVolumeRange>
          <MediaPlaybackRateButton></MediaPlaybackRateButton>
          <MediaPlaybackRateMenuButton></MediaPlaybackRateMenuButton>
          <MediaCaptionsButton></MediaCaptionsButton>
          <MediaAirplayButton></MediaAirplayButton>
          <MediaPipButton></MediaPipButton>
          <MediaFullscreenButton></MediaFullscreenButton>
        </MediaControlBar>
      </MediaController>)}
    </>
  );
};
