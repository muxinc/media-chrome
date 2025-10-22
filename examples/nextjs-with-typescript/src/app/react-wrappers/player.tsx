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

import { useState, useRef, useEffect } from 'react';

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
  const [videoIndex, setVideoIndex] = useState(0);
  const mediaControllerRef = useRef<any>(null);

  // URLs for two different videos to swap between
  const videos = [
    {
      src: "https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4",
      poster: "https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/thumbnail.webp",
      storyboard: "https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/storyboard.vtt",
    },
    {
      src: "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
      poster: "https://image.mux.com/7kq1bRyq8h8d01p2WbQ7tXb9xQ6O3BvZ2YB5j1FSzjNg/thumbnail.webp",
      storyboard: "https://image.mux.com/7kq1bRyq8h8d01p2WbQ7tXb9xQ6O3BvZ2YB5j1FSzjNg/storyboard.vtt",
    }
  ];

  // Log all MediaStore state changes
  useEffect(() => {
    if (!mediaControllerRef.current) return;
    const mediaStore = mediaControllerRef.current.store;
    if (!mediaStore) return;

    let subscriptionId = (window as any).__mediaStoreSubscriptionId || 0;
    subscriptionId++;
    (window as any).__mediaStoreSubscriptionId = subscriptionId;

    console.log(`[MediaStore subscription ${subscriptionId}] created for videoIndex=${videoIndex}, mounted=${mounted}`);

    const unsubscribe = mediaStore.subscribe((state) => {
      console.log('[MediaStore state update]', state);
    });

    return () => {
      unsubscribe();
      console.log(`[MediaStore subscription ${subscriptionId}] unsubscribed for videoIndex=${videoIndex}, mounted=${mounted}`);
    };
  }, [videoIndex, mounted, noDefaultStore]);

  // Log play events on the current video element
  useEffect(() => {
    if (!mediaControllerRef.current) return;
    const mediaController = mediaControllerRef.current;
    const videoEl = mediaController.querySelector('video');
    if (!videoEl) return;

    const onPlay = () => {
      console.log('[Video play event]', videoEl.src);
    };
    videoEl.addEventListener('play', onPlay);

    return () => {
      videoEl.removeEventListener('play', onPlay);
      console.log('[Video play event listener] removed for', videoEl.src);
    };
  }, [videoIndex, mounted]);

  return (
    <>
      <div>
        <button id="mount-btn" onClick={() => setMounted(toggleBool)}>
          {mounted ? 'Unmount' : 'Mount'}
        </button>
        <button id="stress-test-mount-btn" onClick={() => {
          // Rapidly toggle mounted state 5 times to stress test
          let count = 0;
          const interval = setInterval(() => {
            setMounted(m => !m);
            count++;
            if (count >= 5) clearInterval(interval);
          }, 200);
        }}>
          Stress Test Mount/Unmount
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
        <button id="swap-video-btn" onClick={() => setVideoIndex(i => (i + 1) % videos.length)}>
          Swap Video
        </button>
      </div>
      <br />
      {mounted && (
        <MediaController
          ref={mediaControllerRef}
          hotkeys={"noarrowleft noarrowright"}
          style={chromeStyles as any}
          defaultSubtitles
          noDefaultStore={noDefaultStore}
        >
          <video
            key={videoIndex}
            suppressHydrationWarning={true}
            style={{ width: '100%', aspectRatio: 2.4 }}
            slot="media"
            src={videos[videoIndex].src}
            preload="auto"
            muted
            crossOrigin=""
          >
            <track
              label="thumbnails"
              default
              kind="metadata"
              src={videos[videoIndex].storyboard}
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
            src={videos[videoIndex].poster}
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
        </MediaController>
      )}
    </>
  );
};
