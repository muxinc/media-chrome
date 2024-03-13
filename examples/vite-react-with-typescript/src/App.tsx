import { ReactNode, useEffect, useState } from 'react';
import './App.css';
import {
  Provider as MediaChromeProvider,
  useMediaDispatch as useDispatch,
  useFullscreenRefCallback,
  useMediaRefCallback,
  useMediaSelector as useSelector,
} from 'media-chrome/react/media-store';
import { constants } from 'media-chrome';
const { MediaUIEvents } = constants;

const PlayButton = () => {
  const dispatch = useDispatch();
  const mediaPaused = useSelector((state) => state.mediaPaused);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaPaused
          ? MediaUIEvents.MEDIA_PLAY_REQUEST
          : MediaUIEvents.MEDIA_PAUSE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPaused ? 'Play' : 'Pause'}
    </button>
  );
};

const PlaybackRateButton = () => {
  const dispatch = useDispatch();
  const mediaPlaybackRate = useSelector((state) => state.mediaPlaybackRate);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = MediaUIEvents.MEDIA_PLAYBACK_RATE_REQUEST;
        const detail = mediaPlaybackRate === 1 ? 2 : 1;
        dispatch({ type, detail });
      }}
    >
      {mediaPlaybackRate}x
    </button>
  );
};

const MuteButton = () => {
  const dispatch = useDispatch();
  const mediaPseudoMuted = useSelector(
    (state) => state.mediaVolumeLevel === 'off'
  );
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaPseudoMuted
          ? MediaUIEvents.MEDIA_UNMUTE_REQUEST
          : MediaUIEvents.MEDIA_MUTE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPseudoMuted ? 'Unmute' : 'Mute'}
    </button>
  );
};

const CaptionsToggleButton = () => {
  const dispatch = useDispatch();
  const mediaSubtitlesList =
    useSelector((state) => state.mediaSubtitlesList) ?? [];
  const mediaSubtitlesShowing = useSelector(
    (state) => state.mediaSubtitlesShowing
  );
  const showingSubtitles = !!mediaSubtitlesShowing?.length;
  return (
    <button
      style={{ cursor: 'pointer' }}
      disabled={!mediaSubtitlesList?.length}
      onClick={() => {
        const type = showingSubtitles
          ? MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST
          : MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST;
        const detail = showingSubtitles
          ? mediaSubtitlesShowing
          : [mediaSubtitlesList[0]];
        dispatch({ type, detail });
      }}
    >
      {showingSubtitles ? 'Disable Captions' : 'Enable Captions'}
    </button>
  );
};

const PipButton = () => {
  const dispatch = useDispatch();
  const mediaIsPip = useSelector((state) => state.mediaIsPip);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaIsPip
          ? MediaUIEvents.MEDIA_EXIT_PIP_REQUEST
          : MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsPip ? 'Enter Pip' : 'Exit Pip'}
    </button>
  );
};

const FullscreenButton = () => {
  const dispatch = useDispatch();
  const mediaIsFullscreen = useSelector((state) => state.mediaIsFullscreen);
  return (
    <button
      style={{ cursor: 'pointer' }}
      onClick={() => {
        const type = mediaIsFullscreen
          ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
          : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsFullscreen ? 'Enter Fullscreen' : 'Exit Fullscreen'}
    </button>
  );
};

const TimeRange = () => {
  const dispatch = useDispatch();
  const mediaCurrentTime = useSelector((state) => state.mediaCurrentTime);
  const mediaDuration = useSelector((state) => state.mediaDuration);
  return (
    <input
      style={{ flexGrow: 1 }}
      type="range"
      min={0}
      max={Number.isNaN(mediaDuration) ? 0 : mediaDuration}
      value={mediaCurrentTime ?? 0}
      step={0.1}
      onChange={(event) => {
        const type = MediaUIEvents.MEDIA_SEEK_REQUEST;
        const detail = +event.target.value;
        dispatch({ type, detail });
      }}
    />
  );
};

const VolumeRange = () => {
  const dispatch = useDispatch();
  const mediaVolume = useSelector((state) => state.mediaVolume);
  return (
    <input
      type="range"
      min={0}
      max={1}
      value={mediaVolume ?? 0.5}
      step={0.1}
      onChange={(event) => {
        const type = MediaUIEvents.MEDIA_VOLUME_REQUEST;
        const detail = +event.target.value;
        dispatch({ type, detail });
      }}
    />
  );
};

const Video = ({ src }: { src?: string }) => {
  const mediaRefCallback = useMediaRefCallback();
  return (
    <video
      ref={mediaRefCallback}
      slot="media"
      src={src}
      preload="auto"
      muted
      crossOrigin=""
      playsInline
      // controls
    >
      <track
        label="thumbnails"
        default
        kind="metadata"
        src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"
      />
      <track
        label="English"
        kind="captions"
        srcLang="en"
        src="./vtt/en-cc.vtt"
      />
    </video>
  );
};

const Container = ({ children }: { children: ReactNode }) => {
  const fullscreenRefCallback = useFullscreenRefCallback();
  return (
    <div
      id="fullscreen"
      style={{ width: '100vw', display: 'flex', flexDirection: 'column' }}
      ref={fullscreenRefCallback}
    >
      {children}
    </div>
  );
};

const Logger = () => {
  const mediaState = useSelector((state) => state);
  useEffect(() => {
    console.log('mediaState?', mediaState);
  }, [mediaState]);
  return <></>;
};

const ReactPlayer = ({ src }: { src?: string }) => {
  const [attachVideo, setAttachVideo] = useState(true);
  return (
    <MediaChromeProvider>
      <div>
        <label htmlFor="toggleAttachVideo">Attach Video?</label>
        <input
          id="toggleAttachVideo"
          type="checkbox"
          checked={attachVideo}
          onChange={() => setAttachVideo(!attachVideo)}
        />
      </div>
      {/* Uncomment this to log out the latest mediaState as it changes */}
      {/* <Logger /> */}
      <Container>
        {attachVideo ? <Video src={src} /> : null}
        <div style={{ display: 'flex', background: 'black' }}>
          <TimeRange />
        </div>
        <div style={{ display: 'flex', background: 'black' }}>
          <PlayButton />
          <MuteButton />
          <VolumeRange />
          <div style={{ flexGrow: 1 }} />
          <CaptionsToggleButton />
          <PlaybackRateButton />
          <PipButton />
          <FullscreenButton />
        </div>
      </Container>
    </MediaChromeProvider>
  );
};

function App() {
  return (
    <>
      <ReactPlayer src="https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4" />
    </>
  );
}

export default App;
