'use client';
import '@mux/mux-video';
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
  MediaLoopButton,
} from 'media-chrome/react';
import {
  MediaPlaybackRateMenu,
  MediaPlaybackRateMenuButton,
  MediaSettingsMenu,
  MediaSettingsMenuItem,
  MediaSettingsMenuButton,
  MediaRenditionMenu,
  MediaRenditionMenuButton,
  MediaContextMenu,
  MediaContextMenuItem
} from 'media-chrome/react/menu';

import { useState, createElement } from 'react';

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
      <div style={{ padding: '10px', fontSize: '14px', color: '#666' }}>
        <p><strong>Test Persistence:</strong> Change the playback rate (speed) or video quality, then reload the page. Your preferences should be restored automatically.</p>
      </div>
      <br />
      {mounted && (<MediaController hotkeys={"noarrowleft noarrowright"} style={chromeStyles as any} defaultSubtitles noDefaultStore={noDefaultStore}>
        {createElement('mux-video', {
          suppressHydrationWarning: true,
          style: { width: '100%', aspectRatio: 2.4 },
          slot: 'media',
          'playback-id': 'Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008',
          preload: 'metadata',
          muted: true,
          crossOrigin: '',
        }, [
          createElement('track', {
            key: 'thumbnails',
            label: 'thumbnails',
            default: true,
            kind: 'metadata',
            src: 'https://image.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008/storyboard.vtt'
          }),
          createElement('track', {
            key: 'captions',
            label: 'English',
            kind: 'captions',
            srcLang: 'en',
            src: './vtt/en-cc.vtt'
          })
        ])}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          slot="poster"
          src="https://image.mux.com/Sc89iWAyNkhJ3P1rQ02nrEdCFTnfT01CZ2KmaEcxXfB008/thumbnail.webp?time=13"
          style={{
            width: '100%',
            height: '100%',
          }}
          alt="Elephants Dream"
        />
        <MediaContextMenu hidden>
          <MediaContextMenuItem>
            <a href="https://mux.com" target="_blank">Powered by Mux</a>
          </MediaContextMenuItem>
          <MediaContextMenuItem>
            <MediaLoopButton></MediaLoopButton>
          </MediaContextMenuItem>
        </MediaContextMenu>
        <MediaErrorDialog role="dialog" slot="dialog"></MediaErrorDialog>
        <MediaLoadingIndicator
          noAutohide
          slot="centered-chrome"
          style={{ '--media-loading-indicator-icon-height': '200px' } as any}
        ></MediaLoadingIndicator>
        <MediaPlaybackRateMenu role="menu" hidden anchor="auto" rates={[.5, 1, 2]} />
        <MediaRenditionMenu role="menu" hidden anchor="auto">
          <div slot="header">Quality</div>
        </MediaRenditionMenu>
        <MediaControlBar>
          <MediaPlayButton mediaPaused={true}></MediaPlayButton>
          <MediaSeekBackwardButton seekOffset={10}></MediaSeekBackwardButton>
          <MediaSeekForwardButton seekOffset={10}></MediaSeekForwardButton>
          <MediaTimeRange></MediaTimeRange>
          <MediaTimeDisplay showDuration></MediaTimeDisplay>
          <MediaMuteButton mediaVolumeLevel="off"></MediaMuteButton>
          <MediaVolumeRange></MediaVolumeRange>
          <MediaPlaybackRateButton rates={[.5, 1, 2]}></MediaPlaybackRateButton>
          <MediaPlaybackRateMenuButton></MediaPlaybackRateMenuButton>
          <MediaRenditionMenuButton></MediaRenditionMenuButton>
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
