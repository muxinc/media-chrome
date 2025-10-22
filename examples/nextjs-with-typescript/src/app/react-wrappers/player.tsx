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
  MediaErrorDialog,
} from 'media-chrome/react';
import {
  MediaPlaybackRateMenu,
  MediaPlaybackRateMenuButton,
  MediaSettingsMenu,
  MediaSettingsMenuItem,
  MediaSettingsMenuButton,
  MediaRenditionMenu,
} from 'media-chrome/react/menu';

import { useState } from 'react';

const chromeStyles = {
  '--media-primary-color': 'white',
  display: 'block',
  width: '100%',
  aspectRatio: 2.4,
  maxWidth: 960,
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
      {mounted && (<MediaController hotkeys={"noarrowleft noarrowright"} style={chromeStyles as any} defaultSubtitles noDefaultStore={noDefaultStore}>
        <video
          suppressHydrationWarning={true}
          style={{ width: '100%', aspectRatio: 2.4 }}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          slot="poster"
          src="https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/thumbnail.webp"
          style={{
            width: '100%',
            height: '100%',
            background: `center/cover no-repeat url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><filter id="b" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="20"/><feComponentTransfer><feFuncA type="discrete" tableValues="1 1"/></feComponentTransfer></filter><g filter="url(%23b)"><image width="100%" height="100%" preserveAspectRatio="xMidYMid slice" href="data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABwAgCdASoQAAcAAQAcJbACdLoBJgALN3YuJFiQAP6YWQV+kfwz/U15OyfDLJfktLsUBsNc6MmJGK3NclPSL3/5Cvv4BFA+Uq8P/rs/69v1VTpZxcP6J8wAAAA="/></g></svg>')`,
          }}
          alt="woman in misery kneeling down in desert looking up at the sky"
        />
        <MediaErrorDialog role="dialog" slot="dialog"></MediaErrorDialog>
        <MediaLoadingIndicator
          noAutohide
          slot="centered-chrome"
          style={{ '--media-loading-indicator-icon-height': '200px' } as any}
        ></MediaLoadingIndicator>
        <MediaPlaybackRateMenu role="menu" hidden anchor="auto" rates={[.5, 1, 2]} />
        <MediaControlBar>
          <MediaPlayButton mediaPaused={true}></MediaPlayButton>
          <MediaSeekBackwardButton seekOffset={10}></MediaSeekBackwardButton>
          <MediaSeekForwardButton seekOffset={10}></MediaSeekForwardButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaTimeDisplay showDuration mediaDuration={134}></MediaTimeDisplay>
          <MediaMuteButton mediaVolumeLevel="off"></MediaMuteButton>
          <MediaVolumeRange></MediaVolumeRange>
          <MediaPlaybackRateButton rates={[.5, 1, 2]}></MediaPlaybackRateButton>
          <MediaPlaybackRateMenuButton></MediaPlaybackRateMenuButton>
          <MediaSettingsMenuButton></MediaSettingsMenuButton>
          <MediaSettingsMenu role="menu" hidden anchor="auto">
            <MediaSettingsMenuItem>
              Speed
              <MediaPlaybackRateMenu slot="submenu" hidden>
                <div slot="title">Speed</div>
              </MediaPlaybackRateMenu>
            </MediaSettingsMenuItem>
            <MediaSettingsMenuItem>
              Quality
              <MediaRenditionMenu slot="submenu" hidden>
                <div slot="title">Quality</div>
              </MediaRenditionMenu>
            </MediaSettingsMenuItem>
          </MediaSettingsMenu>
          <MediaCaptionsButton></MediaCaptionsButton>
          <MediaAirplayButton></MediaAirplayButton>
          <MediaPipButton></MediaPipButton>
          <MediaFullscreenButton></MediaFullscreenButton>
        </MediaControlBar>
      </MediaController>)}
    </>
  );
};
